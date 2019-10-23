# -*- coding:utf-8 -*-
# @lc app=leetcode.cn id=7 lang=python
#
# [7] 整数反转
#

# @lc code=start
class Solution(object):
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        if (x / 10 == 0):
            x
        absF = 0
        if (x < 0):
            x *= -1
            absF = 1
        x = list(str(x))
        x = [x[i] for i in range(len(x) - 1, -1, -1)] # 生成器大概慢一倍
        # for i in range(int(len(x) / 2)):
        #     [x[i], x[len(x) - 1 - i]] = [x[len(x) - 1 - i], x[i]]
        x = int(''.join(x)) if not absF else int(''.join(x)) * -1
        return x if (x >= (-2)**31 and x <= (2 ** 31 -1)) else 0
res = Solution()
print(res.reverse(4471283))
# @lc code=end

