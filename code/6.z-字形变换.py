# -*- coding:utf-8 -*-
# @lc app=leetcode.cn id=6 lang=python
#
# [6] Z 字形变换
#
# @lc code=start
class Solution(object):
    def convert(self, s, numRows):
        """
        :type s: str
        :type numRows: int
        :rtype: str
        """
        if (numRows <= 1 or numRows >= len(s)):
            return s
        arr = ['' for x in range(numRows)]
        pushSite = 0
        extraSite = 0
        for i in range(len(s)):
            if (extraSite != 0):
                arr[extraSite] += s[i]
                extraSite -= 1
            else:
                arr[pushSite] += s[i]
                pushSite += 1
                if (pushSite == numRows):
                    pushSite = 0
                    extraSite = numRows - 2
        return ''.join(arr)
'''
x     d     q
z  l  l  y
x     z
'''
res = Solution()
print(res.convert('xzxldlzyq', 3))
# @lc code=end

