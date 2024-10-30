n = 8
grid = [
    [-1, -1, -1, 1, 1, -1, -1, 0],
    [-1, 0, -1, -1, -1, 0, -1, -1],
    [-1, 0, 0, -1, -1, -1, -1, -1],
    [1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, 1],
    [-1, -1, 1, -1, -1, -1, -1, -1],
    [0, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
]

rOffsets = [1, 0, -1, 0]
cOffsets = [0, 1, 0, -1]

def inBounds(r, c):
    return r >= 0 and r < n and c >= 0 and c < n

def rowCount(r, num):
    count = 0
    for c in range(n):
        if grid[r][c] == num:
            count += 1
    return count

def colCount(c, num):
    count = 0
    for r in range(n):
        if grid[r][c] == num:
            count += 1
    return count

def identicalRows(r1, r2):
    for c in range(n):
        if grid[r1][c] != grid[r2][c]:
            return False
    return True

def identicalCols(c1, c2):
    for r in range(n):
        if grid[r][c1] != grid[r][c2]:
            return False
    return True

def recurse(square):
    if square == n * n:
        for r1 in range(n):
            for r2 in range(r1 + 1, n):
                if identicalRows(r1, r2):
                    return False
        for c1 in range(n):
            for c2 in range(c1 + 1, n):
                if identicalCols(c1, c2):
                    return False
        return True
    r = square // n
    c = square % n
    if grid[r][c] != -1:
        return recurse(square + 1)
    for num in range(2):
        valid = True
        if rowCount(r, num) == n // 2 or colCount(c, num) == n // 2:
            valid = False
        for dir in range(4):
            r1 = r + rOffsets[dir]
            c1 = c + cOffsets[dir]
            r2 = r + 2 * rOffsets[dir]
            c2 = c + 2 * cOffsets[dir]
            if inBounds(r1, c1) and inBounds(r2, c2):
                if grid[r1][c1] == num and grid[r2][c2] == num:
                    valid = False
        for dir in range(4):
            r1 = r + rOffsets[dir]
            c1 = c + cOffsets[dir]
            r2 = r - rOffsets[dir]
            c2 = c - cOffsets[dir]
            if inBounds(r1, c1) and inBounds(r2, c2):
                if grid[r1][c1] == num and grid[r2][c2] == num:
                    valid = False
        if valid:
            grid[r][c] = num
            if recurse(square + 1):
                return True
            grid[r][c] = -1
    return False

recurse(0)

for row in grid:
    print(row)