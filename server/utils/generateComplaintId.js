import Counter from '../models/Counter.js';

export const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const counterId = `complaint_${currentYear}`;

  const counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const sequenceFormatted = String(counter.seq).padStart(4, '0');
  return `CMP-${currentYear}-${sequenceFormatted}`;
};
