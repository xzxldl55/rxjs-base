#
# @lc app=leetcode.cn id=8 lang=python
#
# [8] 字符串转换整数 (atoi)
#

# @lc code=start
class Solution(object):
    def myAtoi(self, str):
        """
        :type str: str
        :rtype: int
        """
        str = str.lstrip()
        num_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        try:
            absflag = 0
            int_index = 0
            if (str[0] == '-' or str[0] == '+'):
                if (len(str) == 1):
                    return 0
                absflag = 0 if (str[0] == '-') else 1
                str = str[1:]
            while(int_index < len(str) - 1):
                if str[int_index] in num_list:
                    break
                int_index += 1
            if int_index == len(str): 
                return 0
            while(int_index < len(str) - 1):
                int(str[int_index])
                int_index += 1
        except:
            if int_index
            return 0

res = Solution()
print(res.myAtoi('    -dasd'))
        
# @lc code=end

