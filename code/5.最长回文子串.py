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
    #     s = s[start:end + 1]
    #     start = 0
    #     end = len(s) - 1
    #     while (start < int(len(s) / 2)):
    #         if (s[start] != s[end]):
    #             return False
    #         else:
    #             start += 1
    #             end -= 1
    #     return True

    '''
    学习下别人的解法：动态规划法
        （1）我们能够明确，只要一个字符串的最长子串为回文，且其本身首位相同，那么他自己也是一个回文（即，'abcba'中最长子串'bcb'为回文，且a == a，那么'abcba'也为回文）。
            基于此，我们给出状态函数定义：P(i, j) = {0, 1} 「其中，如果∃ P(i, j) = 1，则s[i]~s[j]是一个回文子串，否则（P(i, j) = 0）不是一个回文子串」
        （2）依据上面的状态函数，能够定义出我们的转移方程（即，向外拓展）：P(i, j) = (P(i+1, j-1) and s[i] == s[j])
        （3）接着确定边界条件：首先将最简单的长度为1「必为回文」与长度为2「两字符相同则为回文」的子串是否是回文标注出来，再以此类推标注出所有长度为3的子串...
        （4）其标注方法为滑动窗口，即每次都同时改变start与end的位置「子串长度就不变，相当于向左或者向右滑动了以下」，然后借助其子串标注的结果，来判断是否为回文。
            这样我们才能够完全标注所有子串的回文状态，如此当length + 1后，依旧能够拿上一轮的结果做出判断，以此循序渐进，标注完所有的回文状态
        （5）又因为我们标注回文状态是从短到长标注的，所以再标注时，如果出现回文可以立刻替换最大回文的flag（因为后面出现的永远不会比前面短）。
    '''
    def longestPalindrome(self, s):
        if (len(s) < 2):
            return s
        maxStartIndex = 0
        maxLen = 1
        sLen = len(s)
        # ✨回文状态二维数组
        stateArr = [[x * 0 for x in range(len(s))] for xx in range(len(s))]

        # 构建长度为1与2的回文状态
        for i in range(sLen):
            stateArr[i][i] = 1  # 长度为1比为回文
            if (s[i] == s[i + 1] and i < sLen - 1):  # 防止越界
                stateArr[i][i + 1] = 1
                # 初始记录最长回文子串
                maxLen = 2
                maxStartIndex = i
        if (maxLen == 1):  # 没有长度为2的回文子串，那么必然也没有为3的...
            return s[maxStartIndex:maxLen + 1]
        # 再从3开始搜寻回文状态
        for len in list(range(sLen + 1))[3:]:
            for startIndex in list(range(sLen)):
                


# @lc code=end
res = Solution()
print(res.longestPalindrome('1023102'))



'''
解法 3：动态规划（基于中心对称扩展思想），通过
为了改进暴力法，我们首先观察如何避免在验证回文时进行不必要的重复计算。
考虑 ababa 这个示例。如果我们已经知道 bab 是回文，那么很明显，ababa 一定是回文，因为它的左首字母和右尾字母是相同的。(即，我的最长子串是回文，那么我如果收尾相同那么我就是回文)
1，给出 P(i,j) 的状态定义如下：P(i,j)=1 (s[i]～s[j]是回文子串)(其他情况为0)
2，状态转移方程为：P(i, j) = (P(i+1, j-1)  and s[i] == s[j])
3,边界条件，我们首先初始化一字母和二字母的回文，然后找到所有三字母回文，并依此类推…那么边界条件就是，一字母回文全部初始化为1
初始状态：
dp[i][i]=1; //单个字符是回文串
dp[i][i+1]=1 if s[i]=s[i+1]; //连续两个相同字符是回文串
class Solution {
public:
    string longestPalindrome(string s) {
        int len=s.size();
        if(len==0||len==1)
            return s;
        int start=0;//回文串起始位置
        int max=1;//回文串最大长度
        vector<vector<int>>  dp(len,vector<int>(len));//定义二维动态数组
        for(int i=0;i<len;i++)//初始化状态，边界条件是，所有单字符都是回文，以及两字符回文就是相同的两个字符
        {
            dp[i][i]=1; //单字符回文
            if(i<len-1&&s[i]==s[i+1]) //i<len-1,是为了防止后面判断下标越界
            {
                dp[i][i+1]=1;
                max=2;
                start=i;
            }
        }
        for(int l=3;l<=len;l++)//l表示检索的子串长度，等于3表示先检索长度为3的子串，这里用不同起始的l和i，并且同时++，构成滑动窗口
        {
            for(int i=0;i+l-1<len;i++)
            {
                int j=l+i-1;//终止字符位置
                if(s[i]==s[j]&&dp[i+1][j-1]==1)//状态转移，dp[i+1][j-1] == 1则其最大子串为回文，那么显然如果此时其自身首位相同，比为回文
                {
                    dp[i][j]=1; # 再将其标记为回文，以供dp[i - 1][j + 1]判断
                    start=i; # 标记最大回文起始位置
                    max=l; # 标记最大回文长度，以最后返回
                }
             }
        }
        return s.substr(start,max);//获取最长回文子串
    }
};

解法 4：中心扩展法 通过（类似于dp算法）
回文中心的两侧互为镜像。因此，回文可以从他的中心展开，并且只有 2n-1 个这样的中心（一个元素为中心的情况有 n 个，两个元素为中心的情况有 n-1 个）
再详细讲解就是，中心扩展是选定一个中心，然后扩展回文子串，但中心其实是有两种情况，一种是奇数回文串只有一个元素，一种是偶数回文串的中心有两个元素
class Solution {
public:
    string longestPalindrome(string s) {
        int len=s.size();
        if(len==0||len==1) //长度为 0，1 都是特殊情况
            return s;
        int start=0;//记录回文子串起始位置
        int end=0;//记录回文子串终止位置
        int mlen=0;//记录最大回文子串的长度
        for(int i=0;i<len;i++)
        {
            int len1=expendaroundcenter(s,i,i);//一个元素为中心的最大回文子串长度
            int len2=expendaroundcenter(s,i,i+1);//两个元素为中心的最大回文子串长度
            mlen=max(max(len1,len2),mlen); //取当前重合中心的最大的回文子串长度
            if(mlen>end-start+1)  //此时发现的新的回文子串比之前记录的更长，以对称中心i和长度mlen更新回文字串边界
            {
                start=i-(mlen-1)/2;
                end=i+mlen/2;
            }
        }
        return s.substr(start,mlen);
        //该函数的意思是获取从start开始长度为mlen长度的字符串
    }
private:
    int expendaroundcenter(string s,int left,int right) //中心扩展代码，对于当前对称中心，向两侧扩展回文子串，更新的扩大的回文边界
    //计算以left和right为中心的回文串长度
    {
        int L=left;
        int R=right;
        while(L>=0 && R<s.length() && s[R]==s[L])
        {
            L--;
            R++;
        }
        return R-L-1; //返回的是以当前为中心的最大的回文子串长度
    }
};
下面我用python3实现一遍方法4，中心扩展法，注释我就用英文了，你理解一下：
class Solution:
    def Expand(self, s, left, right): #中心扩展代码，以left，right为中心，向外扩展
        L = left
        R = right
        while L >=0 and R < len(s) and s[L] == s[R]: #两边相等就更新回文子串边界
            L -= 1
            R += 1
        return R - L -1 #返回的是以当前中心的最长的回文子串长度，下面已知中心，当然就可以根据长度求出边界了

    def longestPalindrome(self, s):
        slen = len(s)
        if slen == 0 or slen ==1: #len为 0 1 是特殊情况
            return s
        start = 0 #start和end是记录最长回文子串的左右边界，下面实时更新
        end = 0
        mlen = -1 #这些初始化条件必须要加的，从0开始
        for i in range(slen):
            len1 = self.Expand(s, i, i)
            len2 = self.Expand(s, i, i + 1)
            mlen = max(max(len1, len2), mlen) #分别求以单字符为中心，和双字符为中心的最长回文子串长度，并实时更新为最大
            if mlen > end - start + 1:  #如果遍历到的中心对应的回文子串是最长的，更新结果边界
                start = i - (mlen - 1) // 2
                end = i + mlen // 2
        return s[start:end + 1]

if __name__ == '__main__':
    s = "babad"
    solve = Solution()
    print(solve.longestPalindrome(s))
'''