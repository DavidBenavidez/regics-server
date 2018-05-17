import { Router } from 'express';
import * as Ctrl from './controller';
import { countItems } from '../utils/';

const router = Router();

// Get all User Info
router.get('/api/users-info/:id', async (req, res) => {
  try {
    const { pages } = await countItems('log_data', 15);
    if (req.params.page > pages) {
      res.status(400).json({
        status: 400,
        message: 'Invalid enlisted students pagination'
      });
    } else {
      const id = await Ctrl.getUsersInfo(req.params.id);
      res.status(200).json({
        status: 200,
        data: id
      });
    }
  } catch (status) {
    res.status(status).json({ status });
  }
});

router.put('/api/users/position', async (req, res) => {
  if (req.body.empno && req.body.username && req.body.system_position) {
    try {
      await Ctrl.checkExistsForPrivilege(req.body);
      await Ctrl.editUserPrivilege(
        req.session.user.name,
        req.body.empno,
        req.body.system_position
      );
      const user = await Ctrl.getUser({ empno: req.body.empno });

      res.status(200).json({
        status: 200,
        message: 'Successfully edited user',
        data: user
      });
    } catch (status) {
      res.status(status).json({ status });
    }
  } else {
    res.status(400).json({ status: 400 });
  }
});

// Remove User
router.delete('/api/users/:empno', async (req, res) => {
  try {
    if (req.session.user.empno == req.params.empno) {
      return res.status(400).json({ status: 400 });
    }

    const id = await Ctrl.removeUser(req.session.user.name, req.params);

    res.status(200).json({
      status: 200,
      message: 'successfully deleted user',
      data: id
    });
  } catch (status) {
    res.status(status).json({ status });
  }
});

export default router;
