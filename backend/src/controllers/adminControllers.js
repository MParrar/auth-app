
const { getAuditLogs, getUsers} = require('../services/adminServices');

const getAdminLogs = async (req, res) => {
    try {
      const logs = await getAuditLogs();

      res.status(200).json({
          status: 'success',
          logs: logs.rows
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const getAllUsers = async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = { getAdminLogs, getAllUsers };