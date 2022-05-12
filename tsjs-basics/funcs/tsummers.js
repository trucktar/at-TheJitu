const tSumIndices = (nums, target) => {
  // const b4sort = [...nums];
  // nums.sort((a, b) => a - b);

  const indices = [];
  let i1, i2;
  for (let i = 0; i < nums.length; i++) {
    // if (nums[i] > target) return indices;

    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        i1 = nums.indexOf(nums[i]);
        i2 = nums.indexOf(nums[j]);

        indices.push([i1, i2]);
      }
    }
  }

  return indices;
};

console.log(tSumIndices([1, 8, 6, 4, 3, 1], 4));
console.log(tSumIndices([7, 4, 3, 5, 3, 0], 7));
