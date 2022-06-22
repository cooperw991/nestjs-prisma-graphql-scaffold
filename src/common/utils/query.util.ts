import R from 'ramda';

const splitSearchStr = (query: string): string[] => {
  return R.split(' ')(
    R.trim()(
      R.replace(
        /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g,
        ' ',
      )(query),
    ),
  );
};

export const generateSearchStr = (query: string): string => {
  return R.join(' & ')(splitSearchStr(query));
};

interface PrismaCondition {
  [key: string]: {
    [key: string]: string | number | Array<string> | Array<number> | boolean;
  };
}

interface PrismaWhereOption {
  AND?: PrismaCondition[];
  OR?: PrismaCondition[];
}

const generateBooleanCondition = (key: string, value: boolean): any => {
  const res = {};
  return (res[key] = {
    equals: value,
  });
};

const generateNumberCondition = (key: string, value: number): any => {
  const res = {};
  let keyName = key + '';
  switch (true) {
    case R.test(/^.*GT$/, keyName):
      keyName = keyName.replace(/GT$/, '');
      return (res[keyName] = {
        gt: value,
      });
    case R.test(/^.*GTE$/, keyName):
      keyName = keyName.replace(/GTE$/, '');
      return (res[keyName] = {
        gte: value,
      });
    case R.test(/^.*LT$/, keyName):
      keyName = keyName.replace(/LT$/, '');
      return (res[keyName] = {
        lt: value,
      });
    case R.test(/^.*LTE$/, keyName):
      keyName = keyName.replace(/LTE$/, '');
      return (res[keyName] = {
        lte: value,
      });
    case R.test(/^.*Not$/, keyName):
      keyName = keyName.replace(/Not$/, '');
      return (res[keyName] = {
        not: value,
      });
    default:
      return (res[keyName] = {
        equals: value,
      });
  }
};

const generateArrayCondition = (key: string, value: Array<any>): any => {
  const res = {};
  let keyName = key + '';

  if (R.test(/^.*NotIn$/, keyName)) {
    keyName = keyName.replace(/NotIn$/, '');
    return (res[keyName] = {
      notIn: value,
    });
  } else {
    return (res[keyName] = {
      in: value,
    });
  }
};

const generateStringCondition = (key: string, value: string): any[] => {
  const cObj = {};
  let keyName = key + '';
  let mode = '';
  const res = [];

  if (R.test(/^.*CaseI.*$/, keyName)) {
    mode = 'insensitive';
    keyName = keyName.replace(/CaseI/, '');
  }
  switch (true) {
    case R.test(/^.*SW$/, keyName):
      keyName = keyName.replace(/SW$/, '');
      cObj[keyName] = {
        startsWith: value,
      };
      res.push(cObj);
      break;
    case R.test(/^.*EW$/, keyName):
      keyName = keyName.replace(/EW$/, '');
      cObj[keyName] = {
        endsWith: value,
      };
      res.push(cObj);
      break;
    case R.test(/^.*Search$/, keyName):
      keyName = keyName.replace(/Search$/, '');
      cObj[keyName] = {
        search: generateSearchStr(value),
      };
      res.push(cObj);
      break;
    case R.test(/^.*LTE$/, keyName):
      keyName = keyName.replace(/LTE$/, '');
      cObj[keyName] = {
        lte: value,
      };
      res.push(cObj);
      break;
    case R.test(/^.*Not$/, keyName):
      keyName = keyName.replace(/Not$/, '');
      cObj[keyName] = {
        not: value,
      };
      res.push(cObj);
      break;
    default:
      const keyWords = splitSearchStr(value);
      for (const word of keyWords) {
        cObj[keyName] = {
          contains: word,
        };
        res.push(cObj);
      }

      if (mode) {
        for (const item of res) {
          item.mode = mode;
        }
      }

      return res;
  }
};

export const generateWhereOptions = <T>(
  where: T,
  ifSoftDelete = true,
): PrismaWhereOption => {
  let whereOptions: any = {
    AND: [],
  };
  if (ifSoftDelete) {
    whereOptions.AND.push({
      deletedAt: null,
    });
  }
  for (const key of R.keys()(where)) {
    const value = where[key];
    if (R.isNil(value)) {
      continue;
    }
    let condition;

    switch (R.type(value)) {
      case 'Boolean':
        condition = generateBooleanCondition(key, value);
        whereOptions.AND.push(condition);
        break;
      case 'Number':
        condition = generateNumberCondition(key, value);
        whereOptions.AND.push(condition);
        break;
      case 'String':
        condition = generateStringCondition(key, value);
        whereOptions.AND = [...whereOptions.AND, ...condition];
        break;
      case 'Array':
        condition = generateArrayCondition(key, value);
        whereOptions.AND.push(condition);
        break;
      default:
        break;
    }
  }

  if (!whereOptions.AND.length) {
    whereOptions = R.dissoc('AND')(whereOptions);
  }

  return whereOptions;
};

interface PrismaOrderOption {
  [key: string]: 'desc' | 'asc';
}

interface OrderItem {
  by: string;
  asc: boolean;
}

export const generateOrderOptions = (
  orderItems: OrderItem[],
): PrismaOrderOption[] => {
  const orderBy: PrismaOrderOption[] = [];
  if (!orderItems) {
    return [];
  }
  for (const item of orderItems) {
    const { by, asc } = item;

    const arr = R.split('.', by);

    const keyName = R.last(arr);

    const obj: any = {};
    obj[keyName] = asc ? 'asc' : 'desc';

    const relations = R.dropLast(1, arr);

    let res = obj;

    if (relations.length) {
      res = relations.reduce((prev, current) => {
        const next = {};
        next[current] = prev;
        return next;
      }, obj);
    }

    orderBy.push(res);
  }

  return orderBy;
};
