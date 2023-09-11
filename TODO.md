# TODO

## MVP Final Stretch
* Finish the flower garden puzzle
  - X Create fourth puzzle
  - X Link them all (Garden isSolved)
  - X Message for what rule is broken
  - Solved - Make a mystical door appear
  - Correct particles
  - Handle working on multiple puzzles
  - VR Inventory transform attaches to controller
* Create an end game state (crown with dialog)
* VR Mode bugs
* Hint system/Story dialogs
* Castle texture/top pass
---
* Throne room/witches room
* Drip puzzle

## Story
It is 1290 Scotland, and following the death of Queen Margaret there was no clear successor (the Great Cause). Witches placed a spell on Glamis Castle and whoever could solve the puzzles and enter will claim the kingdom.

## General Bugs
* VR - Flower Puzzle - inventory transform parent to controller model
* W/S moves forward on Z plane always [Forum post](https://forum.babylonjs.com/t/universal-camera-move-on-the-xz-plane-always/43727/7)

## Art
* Castle - Texture the cones
* Castle - Add a slanted roof field for boxes
* Outside - skybox
* Outside - Create thin instances of trees/bushes
* Stretch goal - Castle Window depth shader

## Design
### Dial Puzzle
 * Solved state - Direct the player to the actual door
 * More direction - Color each dial, color each tree

### Flower Box Puzzle
 * Rules
    * Red and Yellow can't be next to each other
    * White must be in groups of exactly 3
    * TODO: Third puzzle with a new rule
    * TODO: Fourth puzzle with all 3 previous rules
    * Optionally create different shapes for each flower color
 * Mechanics - When clicking another puzzle, remove the inventory item of other puzzles
 * Art - Make a clear "success" state with particles
 * Art - Make the flowers spheres, cubes and triangles

### Drip puzzle
* Rules
   * Player clicks a button and starts a drip down a winding line
   * The drip will hit a cauldron and light it up then fade back to rest
   * Three lines of different lengths, the drips need to land at the same time.

### Sculpture/Fountain puzzle
 * Rotate 3d blocks by clicking to create the desired shape
 * Jumping fountain puzzle - A sequence of jumpers can be rotated around, and must be rotated to point toward the next one in the sequence. When the 
 * Solving creates a door that when clicked will teleport to the next room

### Model Puzzle
 * A model has an extra piece, when clicked sends the player to a secret room

### Dining Room puzzle
 * Another rules based puzzle, figure out where to put each meal to match the guest's preferences


# Previously created puzzles
# Harvest Puzzle Box
 * Lights out
 * Musical tones
 * Tsuro Path
 * Code/Cloud

# Tut's Tomb
 * 8-tile sliding puzzle
 * Jars

# 404 Sculpting Done Quick
 * Shaving parts off of a sculpture
 * Trampoline game

# Backlit - Treasure Escape
 * Moving sculptures to cast a shadow
 * Moving Crystals to direct a beam of light
 * Holding an item to cast a shadow in two spots

# 