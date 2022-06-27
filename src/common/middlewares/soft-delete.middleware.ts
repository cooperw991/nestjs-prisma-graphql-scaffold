import dayjs from 'dayjs';
import R from 'ramda';

const hardDeleteModels = [];

const softDeleteMiddleware = async (params, next) => {
  let now;

  if (R.includes(params.model, hardDeleteModels)) {
    return next(params);
  }
  if (params.action === 'delete') {
    now = dayjs().toDate();
    params.action = 'update';
    params.args['data'] = { deletedAt: now };
  }

  if (params.action === 'deleteMany') {
    now = dayjs().toDate();
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data['deletedAt'] = now;
    } else {
      params.args['data'] = { deletedAt: now };
    }
  }

  return next(params);
};

export { softDeleteMiddleware };
