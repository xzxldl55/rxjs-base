#
# @lc app=leetcode.cn id=4 lang=python
#
# [4] 寻找两个有序数组的中位数
#

# @lc code=start
class Solution(object):
    def findMedianSortedArrays(self, nums1, nums2):
        nums1.extend(nums2)
        nums1.sort()
        if (len(nums1) % 2 == 0):
            return (nums1[int(len(nums1) / 2 - 1)] + nums1[int(len(nums1) / 2)]) / 2.0
        else:
            return nums1[int(len(nums1) / 2.0)]
# @lc code=end
res = Solution()
print(res.findMedianSortedArrays([1,3], [2,4]))

