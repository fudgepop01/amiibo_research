# Amiibo Reverse Engineering Notes

pattern: [0x00 - 0x0F]:
offset :: notes:
0x01:
- amiibo on journey
- trade off attacks
- trade off defense
- trade off speed
0x02
- learn: on
- slow super armor
- trade off attacks
- blank
0x03
- learn: off
- super armor
- ???
- ???
0x04
- easier perfect shield
0x05
- easier dodging
- easier perfect shield
0x06
- literally just a shield
- easier dodging
- easier perfect shield
0x07
- lifesteal
- literally just a shield
- blank
0x08
- additional midair jump
- ???
- blank
0x09
- jump up
- additional midair jump
- ???
0x0A
- jump up
- additional midair jump
0x0B
- hyper smash attacks
- literally just a sword
- jump up
0x0C
- move speed up
- hyper smash attacks
- literally just a sword
0x0D
- blank
- move speed up
- hyper smash attacks
0x0E
- blank
- blank
- move speed up
0x0F
- blank
- blank
- blank
0x10
- nothing of importance
0x11
0x12
0x13
0x14
0x17...

pattern: [0x00 - 0xFF]; start on byte 1(2)

218:
- item autograb (1)
217:
- item autograb (2)
216:
- item autograb (3)
213:
- air attack up (1)
212:
- special move power up (1)
- air attack up (2)
211:
- tilt attack up
- special move power up
- air attack up
210:
- neutral attack up ...
209
- hyper smash attacks ...
208
- weapon resist up ...
207
- jam FS charge ...
- ???
- blank
206
- assist killer ...
205
- metal killer
- assist killer
- blank
204
- giant killer ...
203
- activities up ...
202
- heal with smash attacks ...
201
- endless smash holding
200
- defense up when healthy
199 - attack up when healthy
198 - healing item attraction
197 - masterful fall break
196 - perfect shield recovery
195 - sprinting endurance
194 - airborne endurance
193 - no penalty for continuous dodging
192 - poisoned smash
191 - meteor smashes up
190 - BECOME HEAVY

##### 189 - landing lag DOWN DOWN

188 - literally just a foot
187 - super easy dodging
186 - special move power ++
185 - mighty throw
184 - air attack ++
183 - tilt attack ++
182 - tilt attack +
181 - neutral attack ++
180 - neutral attack +
179 - cucco equipped
178 - bomber equipped
177 - screw attack equipped
176 - fire bar equipped
175 - staff equipped
174 - rage blaster equipped
173 - banana gun equipped
172 - ssteel diver equipped
171 - Great Autoheal
170 - critical hit ++
169 - critical-health stats ++
168 - literally just a hammer
167 - stats ++ after eating
166 - literally just a clover thingy
165 - black hole equipped
164 - rocket belt equipped
163 - unira equipped
162 - mr saturn equipped
161 - death's scythe equipped
160 - beastball equipped
159 - super launch star equipped
158 - super leaf equipped
157 - hothead equipped
156 - bob-omb equipped
155 - literally just a clover thingy but size-2
154 - speical move power +
153 - critical health healing
152 - strong-wind immunity
151 - strong-wind resist
150 - stamina +
    - lv 10
149 - gravity change immunity
    - lv 50
    - still dumb as a brick, but stronger
148 - fog immunity
147 - screen flip immunity
146 - literally just a clover but size-1
    - 255 attack
145 - charge speed & power +
    - -2 attack
144 - shooting attack +
    - -259 attack
    - 255 defense
    - will fSmash a lot
143 - weapon attack & move speed +
    - all around
142 - perfect shield reflect
    - much faster
141 - literally just a clover
140 - gift (snack M)
    - literally just a shield (2 slots)
139 - gift (multiple things, including nick)
    - literally just a shield (2 slots)
138 - gift (drake redcrest)
    - literally just a sword
137 - gift (starlow)
    - literally just a hammer
136 - item attack +
135 - boomerang equipped
134 - hammer duration +
133 - energy shot attack/resistance +
132 - literally just a sword
131 - armor knight
130 - dash attack +
129 - giant
128 - metal and giant
127 - literally just a hammer (2 slots)
126 - literally just a hammer (2 slots)
125 - double final smash
124 - chance of double final smash
123 - literally null (1 slot)
122 - 4 SLOTS???
    - item gravitation
    - null slot
    - chance of double final smash
    - sly nature
121 - lava floor resist
    - sly
120 - literally just a clover thing (1 slot)
119 - impact run
118 - edge grab +
    - lightning fast nature
117 - literally just a health box
    - logical nature
116 - literally just a clover thing
    - logical
115 - undamaged attack & speed +
114 - undamaged speed +
    - quick nature
113 - undamaged attack +
    - logical nature
112 - transformation duration +
111 - recovery items +
110 - irreversable controls
    - quick nature
109 - literally just a foot
108 - floaty jumps
    - enthusiastic nature
107 - literally just a clover thing
106 - literally just a sheild
    - attack breaks -10k mark
105 - healing shield
104 - instadrop
103 - fast final smash meter
    - thrill seeker nature
102 - literally just a clover
    - reckless nature
101 - running start
    - technician nature
100 - literally just a clover
    - laid back nature
99 - first strike advantage
   - technician nature
98 - literally just a clover
   - laid back nature
97 - stats + after eating
   - flashy nature
96 - invincibility after eating
   - show-off nature
95 - KOs heal damage
   - flashy nature
94 - thrown items +
   - show-off nature
93 - shooting items +
   - flashy nature
92 - battering items +
   - show-off nature
91 - literally just a clover thing
   - flashy nature
90 - literally just a shield (2 slots)
89 - literally just a shield
   - technician nature
88 - improved escape
   - show-off nature
87 - shield durability +
   - flashy nature
86 - swimmer
   - show-off nature
85 - critical hit +
   - technician nature
84 - literally just a sword
   - show-off nature
83 - toss & meteor
   - technician nature
82 - unflinching charged smashes
   - show-off nature
81 - strong throw
   - tricky nature
80 - down special +
   - cautious nature
79 - up speical +
   - tricky
78 - side special +
   - enthusiastic
77 - neutral special +
   - tricky
76 - air defense +
   - normal nature
75 - air attack +
   - technician
74 - shield damage +
   - cautious
73 - lightweight
   - tricky
72 - landing lag -
   - cautious
71 - literally just a shoe
   - technician
70 - braking ability +
   - light nature
69 - bury immunity
   - tricky
68 - falling immunity
   - show-off
67 - ice floor immunity
   - -20k attack
   - technician
66 - slumber immunity
   - light nature
65 - zap-floor immunity
   - tricky
64 - aura resist +
   - show-off
63 - water/freezing resist
62 - literally just a shield
   - light
61 - energy shot resist
   - tricky
60 - electric resist
   - normal
59 - literally just a shield
   - technician
58 - literally just a shield
   - cautious
57 - fire/explosion resist +
   - tricky
56 - literally just a shield
   - laid back
55 - psi resist
   - tecnhician
54 - magic resist +
   - quick
53 - water * ice attack +
   - light
52 - energy shot attack +
   - normal
51 - electric attack +
   - cool
50 - literally just a sword
   - quick
49 - fire & explosion attack +
   - light
48 - literally just a sword
   - laid back
47 - psi attack +
   - reckless
46 - magic attack +
   - light
45 - aura attack +
   - light
44 - foot attack +
   - laid back
43 - fist attack +
42 - weapon attack +
41 - physical attack +
40 - literally null
39 - killing edge equipped
38 - rabmlin' evil mushroom equipped
   - light
37 - freezie equipped
   - laid back
36 - fire flower equipped
35 - fairy bottle equipped
34 - hammer equipped
33 - franklin badge equipped
   - show-off
32 - mouthful of curry
31 - made of metal
   - flashy
30 - bunny hood equipped
   - show-off
29 - back shield equipped
28 - literally null
27 - poke ball equipped
   - flashy
26 - green shell equipped
   - show-off
25 - drill equipped
24 - gust bellows equipped
23 - super scope equipped
   - flashy
22 - ray gun equipped
   - show-off
21 - home run bat equipped
20 - ore club equipped
19 - star rod equipped
18 - lip's stick equipped
17 - beam sword equipped
   - attack flipped, max is 32638
16 - sticky floor immunity
   - cautious
15 - lava-floor immunity
   - show-off
14 - poison heals
   - normal
13 - poison damage reduced
   - cool
12 - poison immunity
11 - autoheal
10 - critical immunity
   - cautious
9 - critical health stats +
8 - critical health defense +
7 - critical health attack +
  - show-off
6 - trade-off ability +
5 - trade-off speed +
4 - trade-off defense +
3 - trade-off attacks +
  - cool
2 - slow super-armor
  - cautious
1 - super armor
0 - easier perfect shield
  - show-off


OFFSETTING:
1 - easier dodging
2 - literally just a shield
3 - lifesteal
  - normal
4 - additional midair jump
  - cool
5 - jump +
6 - literally just a sword
  - cautious
7 - hyper smash attacks
  - enthusiastic
8 - move speed +
9 - blank
  - reckless
10 - blank
   - enthusiastic
11 - blank
13 - cool
14 - enthusiastic
15 - normal
16 - enthusiastic
17 - reckless
18 - enthusiastic
20 - normal
21 - enthusiastic
23 - laid back
25 - reckless
28 - laid back
29 - tricky
30 - laid back
31 - show-off
32 - flashy
34 - show-off
47 - cautious
51 - normal
52 - cool
54 - cautious
57 - show-off
61 - cool
62 - cautious
65 - show-off
67 - normal
68 - cool
71 - cautious
72 - normal
73 - show-off
74 - light
75 - normal
76 - cool
78 - light
79 - normal
80 - laid back
82 - light
83 - normal
84 - cool
86 - laid back
91 - normal
   - lv.49
92 - laid back
   - lv 48
93 - cool
   - lv 47
94 - laid back, 46
95 - show off, 45
96 - 44
97 - 43
98 - 38
99 - 36
100 - 33
101 - 30
102 - 25
103 - 20
104 - 15
105 - 10
106 - 1
109 - atk = 256
110 - atk = 0
111 - def = 256
    - cautious
112 - def = 0
113 - normal
114 - normal
115 - cool
116 - NO GIFTS
    - cool
118 - cautious
122 - show-off
123 - cool
126 - cautious
129 - show-off
130 - normal
131 - cool
133 - logical
134 - cautious
140 - logical
142 - unflappable
143 - realistic
145 - cautious
147 - logical
148 - sly
185 - blue alt
186 - gold alt
187 - pink alt
188 - off-blue alt
189 - green alt
190 - red alt
    - NORMAL
191 - batman alt
192 - defalt
208 - END AT LAST




---

## Certainties

bytes 00-01 = journey control
byte 02 = learn on / off
byte 03:
  bits 0-1:
  - 00: normal
  - 10: defense
  - 01: attack
  - 11: grab
byte 04

(signed) atk:
  byte [0x70 - 0x71]
(signed) def:
  byte [0x72 - 0x73]

personality:
  bytes [0x88 - 0xC2]
  0x88: jab  0xFF
  0x89: jab? null
  0x8A: ???  
  0x8B: ???
  0x8C: ???
  0x8D: ???
  0x8E: ???
  0x8F: ???
  0x90: ???
  0x91: ???
  0x92: ???
  0x93: ???
  0x94: ???
  0x95: ???
  0x96: ???
  0x97: ???
  0x98: ???
  0x99: ???
  0x9A: ???
  0x9B: ???
  0x9C: ???
  0x9D: ???
  0x9E: ???
  0x9F: ???
  0xA0: ???
  0xA1: ???
  0xA2: ???
  0xA3: ???
  0xA4: ???
  0xA5: ???
  0xA6: ???
  0xA7: ???
  0xA8:

