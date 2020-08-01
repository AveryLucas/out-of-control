## Untitled idle war game I suppose..

### Todo Next

- More nodes
  - Natural roaming soldiers
  - **Soilders on guard.** Soilders will stand post in random sections near team own building and engage enemy soilders when they enter radius
  - Farm Land
    - Farmers can create farmland on fertile ground. Farmers can gather food on farmland. Food is used to generate more units and for upkeep with current units.
    - Soilders will try to protect team owned farmland
  - Inventory needs to be taken back to the team owned fortress before player can use it as a currency.
    - Examples:
      -  Soilders need to return any gold earned through battle before the player can spend it for buildings.
      -  Farmers need to return food earned before player can use it to buy more units

### Todo Today
  
- Buildings
  - Enterable. Each have max capacity.
  - Flags Required:
    - isBuilding
      - Data:
        - currentCapacity
        - maxCapacity 
        - isEnclosed *IE: Difference between a house and open fields. Open fields are limited by tile size (6)*
        - isStackable *IE: Farm land && later roads being in same position*
  - Optional RPG Flags:
    - isRestingSpot *Units can recover health here and/or sleep here during night time? Night time? day night cycle? World flags? omg.*

### Changelog. WooHoo!

- 0.0.2
  - Combat damage calculations based on strength, weapon type proficiency, and weapon damage.
  - Hit chance calculations based on proficiency, agility, and luck
  - Trigger event can now be passed arguments.

- 0.0.1
  - Constants added. File contains all Flags and Weapons.
  - Custom Event functionality added to Flag system..
  - Node class created. Thinking about switching to typescript now...
  - isKillable, hasActionPoints, isUnit, and isSoilder flags created..
  - bareHands weapon created. Stats are placeholders.
  - A bit of love and stuff..
