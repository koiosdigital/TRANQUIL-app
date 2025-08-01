import { defineStore } from "pinia";
import { tableBaseURL } from "@/main";
import { ref } from "vue";

export interface LEDChannel {
  index: number;
  num_leds: number;
  type: 'rgb' | 'rgbw';
}

export interface LEDEffect {
  name: string;
  id: string;
}

export interface LEDChannelConfig {
  color: LEDColor,
  brightness: number;
  speed: number;
  effect_id: string;
  on: boolean;
}

export interface LEDColor {
  r: number;
  g: number;
  b: number;
  w?: number; // Optional for RGBW
}

export const useLEDController = defineStore('LEDController', () => {
  const mainChannelConfig = ref<LEDChannelConfig>({
    color: { r: 255, g: 255, b: 255 },
    brightness: 100,
    speed: 100,
    effect_id: '',
    on: true,
  });

  const setColor = async (color: LEDColor) => {
    const data = await fetch(`${tableBaseURL}/api/led/channel/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ color }),
    });

    if (!data.ok) {
      throw new Error('Failed to set color');
    }

    mainChannelConfig.value.color = color;
  };

  const setSpeed = async (speed: number) => {
    const data = await fetch(`${tableBaseURL}/api/led/channel/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ speed }),
    });

    if (!data.ok) {
      throw new Error('Failed to set speed');
    }

    mainChannelConfig.value.speed = speed;
  };

  const setBrightness = async (brightness: number) => {
    const data = await fetch(`${tableBaseURL}/api/led/channel/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ brightness }),
    });

    if (!data.ok) {
      throw new Error('Failed to set brightness');
    }

    mainChannelConfig.value.brightness = brightness;
  };

  const setEffect = async (effectId: string) => {
    const data = await fetch(`${tableBaseURL}/api/led/channel/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ effect_id: effectId }),
    });

    if (!data.ok) {
      throw new Error('Failed to set effect');
    }

    mainChannelConfig.value.effect_id = effectId;
  };

  const setPower = async (on: boolean) => {
    const data = await fetch(`${tableBaseURL}/api/led/channel/0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ on }),
    });
    if (!data.ok) {
      throw new Error('Failed to set power');
    }
    mainChannelConfig.value.on = on;
  };

  const getAllEffects = async (): Promise<LEDEffect[]> => {
    const res = await fetch(`${tableBaseURL}/api/led/effects`);
    if (!res.ok) throw new Error('Failed to fetch effects');
    return res.json() as Promise<LEDEffect[]>;
  };

  const refreshMainChannelConfig = async () => {
    const res = await fetch(`${tableBaseURL}/api/led/channel/0`);
    if (!res.ok) throw new Error('Failed to fetch main channel config');
    const data = await res.json();
    mainChannelConfig.value = data as LEDChannelConfig;
  };

  refreshMainChannelConfig();

  return {
    mainChannelConfig,
    setColor,
    setSpeed,
    setBrightness,
    setEffect,
    getAllEffects,
    setPower,
  };
});
