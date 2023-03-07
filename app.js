function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 150,
      counterRoundSpecialAttack: 0,
      counterRoundHeal: 0,
      result: null,
      battleLog: [],
    };
  },
  computed: {
    playerHealthBar() {
      if (this.playerHealth < 0) {
        this.playerHealth = 0;
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    monsterHealthBar() {
      if (this.monsterHealth < 0) {
        this.monsterHealth = 0;
        return { width: "0%" };
      }
      return { width: this.monsterHealth / 1.5 + "%" };
    },
  },
  watch: {
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.result = "draw";
      } else if (value <= 0) {
        this.result = "win";
      }
    },
    playerHealth(value) {
      if (this.monsterHealth <= 0 && value <= 0) {
        this.result = "draw";
      } else if (value <= 0) {
        this.result = "lose";
      }
    },
  },
  methods: {
    startNewGame() {
      this.playerHealth = 100;
      this.monsterHealth = 150;
      this.counterRoundSpecialAttack = 0;
      this.counterRoundHeal = 0;
      this.result = null;
      this.battleLog = [];
    },
    attackMonester() {
      const attackValue = getRandomNumber(10, 12);
      this.monsterHealth -= attackValue;
      this.getBattleLog("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomNumber(7, 16);
      this.playerHealth -= attackValue;
      this.getBattleLog("monster", "attack", attackValue);
    },
    specialAttack() {
      this.counterRoundSpecialAttack++;
      const attackValue = getRandomNumber(25, 30);
      this.monsterHealth -= attackValue;
      this.getBattleLog("player", "attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      if (this.playerHealth < 100) {
        this.counterRoundHeal++;
        const healValue = getRandomNumber(20, 35);
        this.getBattleLog("player", "heal", healValue);
        if (this.playerHealth + healValue > 100) {
          this.playerHealth = 100;
        } else {
          this.playerHealth += healValue;
        }
      }
    },
    surrendPlayer() {
      this.result = "lose";
    },
    getBattleLog(who, what, value) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
}).mount("#game");
