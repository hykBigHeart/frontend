import { createSlice } from "@reduxjs/toolkit";

type SystemConfigStoreInterface = {
  systemApiUrl: string;
  systemPcUrl: string;
  systemH5Url: string;
  systemLogo: string;
  systemName: string;
  pcIndexFooterMsg: string;
  playerPoster: string;
  playerIsEnabledBulletSecret: string;
  playerBulletSecretText: string;
  playerBulletSecretColor: string;
  playerBulletSecretOpacity: string;
};

let defaultValue: SystemConfigStoreInterface = {
  systemApiUrl: "",
  systemPcUrl: "",
  systemH5Url: "",
  systemLogo: "",
  systemName: "",
  pcIndexFooterMsg: "",
  playerPoster: "",
  playerIsEnabledBulletSecret: "",
  playerBulletSecretText: "",
  playerBulletSecretColor: "",
  playerBulletSecretOpacity: "",
};

const systemConfigSlice = createSlice({
  name: "systemConfig",
  initialState: {
    value: defaultValue,
  },
  reducers: {
    saveConfigAction(stage, e) {
      stage.value = e.payload;
    },
  },
});

export default systemConfigSlice.reducer;
export const { saveConfigAction } = systemConfigSlice.actions;

export type { SystemConfigStoreInterface };
