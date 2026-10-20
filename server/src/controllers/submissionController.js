const { z } = require('zod');
const prisma = require('../config/db');
const creditService = require('../services/creditService');
const walletService = require('../services/walletService');

const itemSchema = z.object({
  categoryId: z.string(),
  quantity: z.number().int().min(1).default(1),
  weightKg: z.number().min(0.01).optional().nullable(),
  photoUrls: z.array(z.string()).default([]),
});

const createSubmissionSchema = z.object({
  pickupAddress: z.string().min(5, 'Pickup address required'),
  pickupSlot: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

const verifySchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      grade: z.enum(['A', 'B', 'C', 'REJECTED']),
      weightKg: z.number().optional().nullable(),
    })
  ).min(1, 'Grading data for items required'),
  notes: z.string().optional(),
});

// POST /api/submissions (USER)
const createSubmission = async (req, res, next) => {
  try {
    const validated = createSubmissionSchema.parse(req.body);

    const submission = await prisma.submission.create({
      data: {
        userId: req.user.id,
        status: 'REQUESTED',
        pickupAddress: validated.pickupAddress,
        pickupSlot: validated.pickupSlot ? new Date(validated.pickupSlot) : null,
        notes: validated.notes || null,
        items: {
          create: validated.items.map((item) => ({
            categoryId: item.categoryId,
            quantity: item.quantity,
            weightKg: item.weightKg,
            photoUrls: item.photoUrls,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      data: submission,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions/mine (USER)
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: submissions,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions?status= (COLLECTOR/ADMIN)
const getAllSubmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: submissions,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/submissions/:id
const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: true,
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Submission not found',
      });
    }

    // Authorization check
    if (req.user.role === 'USER' && submission.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: submission,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/submissions/:id/cancel (USER only if REQUESTED)
const cancelSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      return res.status(404).json({ success: false, data: null, error: 'Submission not found' });
    }

    if (submission.userId !== req.user.id) {
      return res.status(403).json({ success: false, data: null, error: 'Access denied' });
    }

    if (submission.status !== 'REQUESTED') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Can only cancel submissions in REQUESTED status',
      });
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/submissions/:id/schedule (ADMIN/COLLECTOR)
const scheduleSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pickupSlot } = req.body;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        collectorId: req.user.id,
        pickupSlot: pickupSlot ? new Date(pickupSlot) : undefined,
      },
    });

    res.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/submissions/:id/collect (COLLECTOR)
const collectSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status: 'COLLECTED',
        collectorId: req.user.id,
      },
    });

    res.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/submissions/:id/verify (COLLECTOR/ADMIN)
// Transactional verification and credit posting (Section 6 & 8)
const verifySubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = verifySchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch submission with lock
      const submission = await tx.submission.findUnique({
        where: { id },
        include: {
          items: true,
          user: true,
        },
      });

      if (!submission) {
        throw new Error('Submission not found');
      }

      // Guard against double credit
      if (submission.status === 'VERIFIED') {
        throw new Error('This submission has already been verified and credited.');
      }

      // 2. Fetch categories for rate lookup
      const categories = await tx.ewasteCategory.findMany();
      const categoryMap = new Map(categories.map((c) => [c.id, c]));

      // 3. Check if first verified submission for user
      const priorVerified = await tx.submission.count({
        where: {
          userId: submission.userId,
          status: 'VERIFIED',
        },
      });
      const isFirstSubmission = priorVerified === 0;

      // 4. Update items and compute credits
      const itemsToScore = submission.items.map((item) => {
        const itemInput = validated.items.find((vi) => vi.itemId === item.id) || {};
        const cat = categoryMap.get(item.categoryId);
        return {
          id: item.id,
          category: cat,
          quantity: item.quantity,
          weightKg: itemInput.weightKg !== undefined ? itemInput.weightKg : item.weightKg,
          grade: itemInput.grade || 'B',
        };
      });

      const { totalCredits, itemCreditsList, firstSubmissionBonus, bulkBonus } =
        creditService.calculateSubmissionCredits(itemsToScore, isFirstSubmission);

      // Write individual item grades and credits
      for (const itemScored of itemCreditsList) {
        const input = validated.items.find((vi) => vi.itemId === itemScored.itemId);
        await tx.submissionItem.update({
          where: { id: itemScored.itemId },
          data: {
            grade: input?.grade || 'B',
            weightKg: input?.weightKg !== undefined ? input.weightKg : undefined,
            credits: itemScored.credits,
          },
        });
      }

      // 5. Update submission status to VERIFIED
      const updatedSubmission = await tx.submission.update({
        where: { id },
        data: {
          status: 'VERIFIED',
          totalCredits,
          collectorId: req.user.id,
          notes: validated.notes || submission.notes,
        },
      });

      // 6. Write EARN transaction to user's wallet ledger
      await tx.walletTransaction.create({
        data: {
          userId: submission.userId,
          type: 'EARN',
          amount: totalCredits,
          refId: submission.id,
          note: `Recycling Credits for Submission #${submission.id.slice(0, 8)}${
            firstSubmissionBonus ? ' (incl. First-Time Bonus)' : ''
          }${bulkBonus ? ' (incl. Bulk Bonus)' : ''}`,
        },
      });

      // 7. Check referral bonus if first verification
      if (isFirstSubmission && submission.user.referredById) {
        const referralBonus = Number(process.env.REFERRAL_BONUS) || 25;

        // Credit to the referee (the citizen who recycled)
        await tx.walletTransaction.create({
          data: {
            userId: submission.userId,
            type: 'BONUS',
            amount: referralBonus,
            refId: submission.id,
            note: 'Referral Welcome Bonus',
          },
        });

        // Credit to the referrer
        await tx.walletTransaction.create({
          data: {
            userId: submission.user.referredById,
            type: 'BONUS',
            amount: referralBonus,
            refId: submission.id,
            note: `Referral Reward for inviting ${submission.user.name}`,
          },
        });
      }

      return {
        submission: updatedSubmission,
        creditsAwarded: totalCredits,
      };
    });

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/submissions/:id/reject (COLLECTOR/ADMIN)
const rejectSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        collectorId: req.user.id,
        notes: reason || 'Item inspection failed safety or acceptance criteria.',
      },
    });

    res.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  getSubmissionById,
  cancelSubmission,
  scheduleSubmission,
  collectSubmission,
  verifySubmission,
  rejectSubmission,
};
