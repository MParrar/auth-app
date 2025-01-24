const pool = require('../config/db');

const createAuditLog = async (req, oldData) => {
  const user = req.user;

  const logData = {
    userId: user.userId,
    action: `${req.method} ${req.originalUrl}`,
    url: req.originalUrl,
    method: req.method,
    newData: req.body,
    oldData,
    timestamp: new Date(),
  };

  await saveAuditLog(logData);
};

const saveAuditLog = async (logData) => {
  const query = `
      INSERT INTO audit_logs (user_id, action, url, method, new_data, old_data, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

  const values = [
    logData.userId,
    logData.action,
    logData.url,
    logData.method,
    logData.newData ? JSON.stringify(logData.newData) : null,
    logData.oldData ? JSON.stringify(logData.oldData) : null,
    logData.timestamp,
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    throw new Error(error);
  }
};

const getAuditLogs = async () => {
  const logs = await pool.query(
    `SELECT public.audit_logs.id, name, action, old_data, new_data, timestamp FROM public.audit_logs
      inner join public.user on public.user.id = public.audit_logs.user_id`
  );
  return logs;
};

const getUsers = async () => {
  const users = await pool.query(
    'SELECT id, name, email, role FROM public.user order by id'
  );
  return users.rows;
};

module.exports = { createAuditLog, getAuditLogs, getUsers};
