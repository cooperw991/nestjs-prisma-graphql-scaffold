import dayjs from 'dayjs';
import R from 'ramda';

// TODO(): auto judge if model should delete or soft delete
const hardDeleteModels = [];

const softDeleteMiddleware = async (params, next) => {
  let now;
  const { include } = params.args;
  const relations = R.keys(include);

  if (R.includes(params.model, hardDeleteModels)) {
    return next(params);
  }
  if (params.action === 'delete') {
    now = dayjs().toDate();
    params.action = 'update';
    params.args['data'] = { deletedAt: now };
    for (const relation of relations) {
      params.args['data'][relation] = {
        update: {
          deletedAt: now,
        },
      };
    }
  }

  if (params.action === 'deleteMany') {
    now = dayjs().toDate();
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data['deletedAt'] = now;
    } else {
      params.args['data'] = { deletedAt: now };
    }

    for (const relation of relations) {
      params.args.data[relation] = {
        update: {
          deletedAt: now,
        },
      };
    }
  }

  return next(params);
};

export { softDeleteMiddleware };
