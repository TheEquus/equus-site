---
title: "Bonding with ModelSim in ImaginaryCTF 2021"
date: 24 Jul 2021
draft: true
toc: true
categories: ["CTF"]
---

This will be a writeup of both Normal(Rev, 150pts) and Abnormal(Rev, 250pts).

In these two challenges, we're giving circuits written in Verilog. Evidently, our goal is to determine the input that will satisfy the digital circuit, and that input will be the flag we need.

Having just lost too many hours of sleep slaving over a similar sort of problem in GoogleCTF, I was clearly prepared to take on the challenge.

## Normal
A brief description of what's happening with illustrations.
Just quickly taking a glimpse at the code provided, we can see that it will print correct if and only if the output of the final function is 0. So all that's left to do is to find the input that's needed. That can't be too hard now, can it?
Well in this case it's relatively straight forward! For each input bit i, only the i'th bit of the output is affected. That means if I change bit 5, then only the output of bit 5 is affected. This is fantastic news, as this means we can use verilog itself to solve the circuit. By checking if the output bit, if we see it's 0, we leave it alone, and move on, otherwise, we flip the bit.
Just pass the verilog over to the lovely modelsim, and we can instantly get our flag!
Other possible solutions: Now if ModelSim isn't quite your cup of tea, it's possible to use RTL viewer provided with Quartus. It's great in that it can simplify the circuit, to the point where you can grab the answer somewhat immediately. However, given that there is a lot of input, it'll be tedious to determine which bits are 1, and which are 0 based solely on the circuit (annoyingly there is no way to export the RTL viewer, other than as a PDF).

## Abnormal
Now we hit the bigger sibling of Normal. This gives us a much more complicated digital circuit relative to Normal, and that means that we can't just reuse our solution. After some admittedly foolish attempts to try and use boolean algebra/logic to simplify the circuit by hand, it turns out the circuit really was simpler than it seemed.

Working backwards from the answer, we can determine what w1 and w2 should be (clearly the extra circuitry was just a weird kind of way to show off).

Significantly more circuitry making it way more complicated. use some boolean algebra/logic to determine what w1 and w2 should be in the abnormal module.
notice how input is split into chunks of 16
bruteforce the answer, one 16 bit chunk at a time (from lsb to msb) and get a solution.  
warnings: time matters. circuitry can be a little slow (may need to test again as code may just be wrong)
