const argSum = (...nums) => {
  return recSum(nums, nums.length - 1);
};
const recSum = (nums, n) => {
  if (n == 0) return nums[n];
  return nums[n] + recSum(nums, n - 1);
};