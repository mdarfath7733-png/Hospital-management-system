const Counter = require('../models/Counter');

/**
 * Generate sequential IDs with custom prefix and padding (e.g. STF-0001, PAT-0001)
 * @param {string} counterName - The identifier in Counter collection (e.g., 'staffId', 'patientId')
 * @param {string} prefix - The prefix string (e.g. 'STF-', 'PAT-')
 * @param {number} padLength - Number of digits to pad with leading zeros (default: 4)
 * @returns {Promise<string>} - Formatted sequential ID
 */
const getNextSequenceValue = async (counterName, prefix = '', padLength = 4) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = sequenceDocument.seq.toString().padStart(padLength, '0');
  return `${prefix}${seqNumber}`;
};

module.exports = { getNextSequenceValue };
