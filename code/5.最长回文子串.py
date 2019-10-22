# -*- coding:utf-8 -*-
# @lc app=leetcode.cn id=5 lang=python
#
# [5] 最长回文子串
#

# @lc code=start
class Solution(object):
    # 暴力求解：超时了---O..O---
    # def longestPalindrome(self, s):
    #     if (len(s) == 0 or len(s) == 1):
    #         return s
    #     endIndex = len(s) - 1
    #     startIndex = 0
    #     maxSubStr = s[0]
    #     preStrLen = 0
    #     while (startIndex < len(s) - 1):
    #         if (self.isPalindrome(startIndex, endIndex, s)): # 从后向前找，找到回文
    #             maxSubStr = s[startIndex: endIndex + 1] if (len(s[startIndex: endIndex + 1]) > len(maxSubStr)) else maxSubStr
    #             preStrLen = len(s[startIndex: endIndex + 1])
    #             startIndex += 1
    #             if (startIndex == 1 and endIndex == len(s) - 1):
    #                 break
    #             endIndex = len(s) - 1
    #         else:
    #             if (endIndex <= startIndex): # 本回合搜索失败，开始下一回合
    #                 startIndex += 1
    #                 endIndex = len(s) - 1
    #             else: # 继续向前搜索
    #                 endIndex -= 1
    #     return maxSubStr
    # def isPalindrome(self, start, end, s):
        s = s[start:end + 1]
        start = 0
        end = len(s) - 1
        while (start < int(len(s) / 2)):
            if (s[start] != s[end]):
                return False
            else:
                start += 1
                end -= 1
        return True
    
    # 学习一下别人的怎么解的
    def longestPalindrome(self, s):
        
# @lc code=end
res = Solution()
print(res.longestPalindrome('1023102'))



const int n = str.size()
if(n < 2) return str
int s = 0, e = 0
int dp[n] = {0, }
for(int j = 0; j < n; ++j){
    for(int i = 0; i < j; ++i){
        if(!(dp[i] = dp[i + 1] || str[i] != str[j]) && (e - s) <= (j - i))
            s = i, e = j;
    }
}
return str.substr(s, e - s + 1)