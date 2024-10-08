import random

pars = [3, 4, 5]
clubs = [
  "Driver",
  "3-Wood",
  "4-Wood",
  "5-Wood",
  "7-Wood",
  "2-Hybrid",
  "3-Hybrid",
  "4-Hybrid",
  "5-Hybrid",
  "2-Iron",
  "3-Iron",
  "4-Iron",
  "5-Iron",
  "6-Iron",
  "7-Iron",
  "8-Iron",
  "9-Iron",
  "Pitching Wedge",
  "Gap/Approach Wedge",
  "Lob Wedge",
  "Sand Wedge",
]
teeShots = ["Left", "Fairway", "Right"]
approachShots = [
  "GIR",
  "Short Right",
  "Short Left",
  "Left",
  "Long Left",
  "Long Right",
  "Right",
]

newPar = random.choice(pars)
print("Par: ", newPar)
if newPar == 3:
    print("Yardage:", random.randint(140, 200))
    print("Score:", random.randint(2, 5))
elif newPar == 4:
    print("Yardage:", random.randint(300, 450))
    print("Score:", random.randint(3, 6))
    print("Tee Club:", random.choice(clubs))
    print("Tee Shot:", random.choice(teeShots))
else:
    print("Yardage:", random.randint(500, 700))
    print("Score:", random.randint(4, 7))
    print("Tee Club:", random.choice(clubs))
    print("Tee Shot:", random.choice(teeShots))

print("Approach Club:", random.choice(clubs))
approachShot = random.choice(approachShots)
print("Approach Shot:", approachShot)
if approachShot != "GIR":
    print("Up and Down:", random.choice([True, False]))
    print("Up and Down Club:", random.choice(clubs))

print("Total Putts:", random.randint(1, 4))
print("First Putt Distance:", random.randint(1, 30))
print("Penalty Strokes:", random.randint(0, 2))
print("Shots Inside 100:", random.randint(0, 4))