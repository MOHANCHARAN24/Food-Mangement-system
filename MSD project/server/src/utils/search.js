export const buildRestaurantSearchFilter = ({ q, isTopPick, tags }) => {
  const filter = {};

  if (q) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { name: regex },
      { cuisine: regex },
      { highlights: regex },
      { tags: regex },
      { 'address.area': regex },
      { 'address.city': regex },
    ];
  }

  if (typeof isTopPick !== 'undefined') {
    const parsed = typeof isTopPick === 'string' ? isTopPick === 'true' : Boolean(isTopPick);
    filter.isTopPick = parsed;
  }

  if (tags) {
    const tagArray = String(tags)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (tagArray.length) {
      filter.tags = { $in: tagArray };
    }
  }

  return filter;
};

export default {
  buildRestaurantSearchFilter,
};
