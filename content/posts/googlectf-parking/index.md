---
title: "Inefficiently solving GoogleCTF 2021 with Verilog (ModelSim)"
date: 28 Jul 2021
draft: true
toc: true
categories: ["CTF"]
---

I unfortunately did not solve this during the competition period, but obsessed over this for about a week after the competition. Here's how I lost a bucket load of hours of sleep.  

## Introduction
The challenge provides us with a [zip file](https://github.com/google/google-ctf/tree/master/2021/quals/hw-parking/attachments) containing a python script that takes in some data (level1 / level2) to build the challenge. run.sh just serves as an easy way to progress from level1 to level2.

### Level 1
{{< img level1.png >}}  
Well this doesn't seem too bad... We're told (in the command line) that the goal is to simply move the red car from its original position, and the green block will encode the flag. Just shift the blocks around and it's as simple as that. Bring on level 2!

### Level 2
{{< img level2.png >}}
Well... I can almost see my life flashing before my eyes. Analysing this through the matplotlib graph it creates would be a pain (especially given that it took about a minute to load the graph itself). Clearly, we need to analyse how it's getting the map.

## Analysis
Let's take a look at the [game.py](https://github.com/google/google-ctf/blob/master/2021/quals/hw-parking/attachments/game.py) script first.  
A quick skim through the code reveals that it parses the data determined by the level1/level2 file, builds the massive carpark, and allows for the user to click to move cars. There are a few important things to note:  
- First, the red block has "movable" attribute set to -2, and if the script detects that the block has moved from its original position, the `printflag()` command is called.  
- Second, it adds the cars that have its "moveable" attribute set to -1 to a flagblocks array. These cars are the green blocks that encode the flag (in binary).   
- On top of that, the each car represents each bit of the flag, and is determined by whether the car has to move from its original position (move = 1, no move = 0).  
- And finally, the bits of the flag are separated into bytes (8 bits) and reversed before being printed.

With all those in mind, we have a good enough overview of what we need to do: Determine which green blocks need to be moved in order for the red block to move.  

Now the hours of "fun" begin.

### Diving deeper
Whilst we have a general idea of how everything works, how in the world do we apply it here? Most importantly, where in the world are the green and red blocks?
{{< img grepmylife.png >}}
Doing a quick grep on the level2 file (based on -1 == green block, and -2 == red block), we can see that there are a lot of green blocks (64 in fact) all in a line, and one singular red block in a tiny corner. We know this, as the python script parses the file info as (x,y,w,h,movable).
