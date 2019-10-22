# -*- coding:utf-8 -*-
# 求最长无重复字串长度

## 暴力求解
def subStrMaxLen(s):
  if (len(s) == 0):
    return 0
  parseChar = ''
  startIndex = 0
  endIndex = 0
  maxLen = 0
  while (endIndex < len(s)):
    if (s[endIndex] in parseChar):
      maxLen = (endIndex - startIndex) if ((endIndex - startIndex) > maxLen) else maxLen
      startIndex += 1
      endIndex = startIndex
      parseChar = ''
    else:
      parseChar += s[endIndex]
      endIndex += 1
  return maxLen if ((endIndex - startIndex) < maxLen) else (endIndex - startIndex)

# print(subStrMaxLen('abcabbc'))

# 优化：通过添加一个标志变量，确定上一次搜索到的子串长度是多少，比如（abcbcca中，上次搜的是abc，长度为3，所以此时窗口向右滑动，start=end=1，由于上次长度为3，即3-1=2，从1-2的位置上次都已经搜索过了没有重复串，所以可以直接略过，end = start + preLen - 1开始搜索）
def optimizeMaxLen(s):
  if (len(s) == 0):
    return 0
  parseChar = ''
  startIndex = 0
  endIndex = 0
  maxLen = 0
  preLen = 0
  while (endIndex < len(s)):
    if (s[endIndex] in parseChar):
      maxLen = (endIndex - startIndex) if ((endIndex - startIndex) > maxLen) else maxLen
      preLen = (endIndex - startIndex)
      startIndex += 1
      endIndex = startIndex + preLen - 1
      parseChar = s[startIndex:endIndex]
    else:
      parseChar += s[endIndex]
      endIndex += 1
  return maxLen if ((endIndex - startIndex) < maxLen) else(endIndex - startIndex)
print(optimizeMaxLen('abcabbc'))