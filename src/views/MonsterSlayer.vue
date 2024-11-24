<script setup lang="ts">
// Data
import { computed, ref, watch } from 'vue'

const playerHealth = ref(100);
const monsterHealth = ref(150);
const counterRoundSpecialAttack = ref(0);
const counterRoundHeal = ref(0);
const result = ref('');
const battleLog = ref([]);

// Computed
const playerHealthBar = computed(() => {
  if (playerHealth.value < 0) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    playerHealth.value = 0;
    return { width: "0%" };
  }
  return { width: playerHealth.value + "%" };
});

const monsterHealthBar = computed(() => {
  if (monsterHealth.value < 0) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    monsterHealth.value = 0;
    return { width: "0%" };
  }
  return { width: monsterHealth.value / 1.5 + "%" };
});

// Methods
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const startNewGame = () => {
  playerHealth.value = 100;
  monsterHealth.value = 150;
  counterRoundSpecialAttack.value = 0;
  counterRoundHeal.value = 0;
  result.value = '';
  battleLog.value = [];
};

const attackMonester = () => {
  const attackValue = getRandomNumber(10, 12);
  monsterHealth.value -= attackValue;
  getBattleLog("player", "attack", attackValue);
  attackPlayer();
};

const attackPlayer = () => {
  const attackValue = getRandomNumber(7, 16);
  playerHealth.value -= attackValue;
  getBattleLog("monster", "attack", attackValue);
};

const specialAttack = () => {
  counterRoundSpecialAttack.value++;
  const attackValue = getRandomNumber(25, 30);
  monsterHealth.value -= attackValue;
  getBattleLog("player", "attack", attackValue);
  attackPlayer();
};

const healPlayer = () => {
  if (playerHealth.value < 100) {
    counterRoundHeal.value++;
    const healValue = getRandomNumber(20, 35);
    getBattleLog("player", "heal", healValue);
    if (playerHealth.value + healValue > 100) {
      playerHealth.value = 100;
    } else {
      playerHealth.value += healValue;
    }
  }
};

const surrendPlayer = () => {
  result.value = "lose";
};

const getBattleLog = (who: string, what: string, value: number) => {
  battleLog.value.unshift({
    actionBy: who,
    actionType: what,
    actionValue: value,
  });
};

// Watch
watch(monsterHealth, (newValue: number, oldValue: number) => {
  if (newValue <= 0 && playerHealth.value <= 0) {
    result.value = "draw";
  } else if (newValue <= 0) {
    result.value = "win";
  }
});

watch(playerHealth, (newValue: number, oldValue: number) => {
  if (monsterHealth.value <= 0 && newValue <= 0) {
    result.value = "draw";
  } else if (newValue <= 0) {
    result.value = "lose";
  }
});
</script>

<template>
  <div>
    <header>
      <h1>Monster Slayer</h1>
    </header>
    <div id="game">
      <section id="monster" class="container">
        <h2>Monster Health</h2>
        <div class="healthbar">
          <div class="healthbar__value" :style="monsterHealthBar">{{monsterHealth}}</div>
        </div>
      </section>
      <section id="player" class="container">
        <h2>Your Health</h2>
        <div class="healthbar">
          <div class="healthbar__value" :style="playerHealthBar">{{playerHealth}}</div>
        </div>
      </section>
      <section class="container" v-if="result">
        <h2 v-if="result === 'lose'">Game Over <p> You Lost :(</p>
        </h2>
        <h2 v-else-if="result === 'win'">You Win!</h2>
        <h2 v-else>It's Draw</h2>
        <button @click="startNewGame">Start New Game</button>
      </section>
      <section id="controls" v-else>
        <button @click="attackMonester">ATTACK</button>
        <button @click="specialAttack" :disabled="counterRoundSpecialAttack === 2">SPECIAL ATTACK
          ({{counterRoundSpecialAttack}}/2)</button>
        <button @click="healPlayer" :disabled="counterRoundHeal === 1">HEAL ({{counterRoundHeal}}/1)</button>
        <button @click="surrendPlayer">SURRENDER</button>
      </section>
      <section id="log" class="container">
        <h2>Battle Log</h2>
        <ul>
          <li v-for="(log, index) in battleLog" :key="index">
          <span
            :class="{'log--player': log.actionBy === 'player','log--monster': log.actionBy === 'monster'}">{{log.actionBy}}
          </span>
            <span>
            <span v-if="log.actionType === 'attack'"> Attacks and deals </span>
            <span v-else> heals himself by </span>
          </span>
            <span :class="{'log--damage': log.actionType === 'attack','log--heal': log.actionType === 'heal'}">
            {{log.actionValue}}
          </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
