<template>
  <v-row align="start" justify="start">
    <v-col cols="12" sm="12" md="6" lg="4" v-for="result in results" :key="result.nimTpb">
      <v-card height="150px">
        <v-card-title class="d-block text-truncate">{{ result.nama }}</v-card-title>
        <v-card-subtitle>{{ result.jurusan }}</v-card-subtitle>
        <v-card-text>
          <span v-if="result.nim">
            NIM Jurusan: {{ result.nim }}
            <br />
          </span>
          NIM TPB: {{ result.nimTpb }}
        </v-card-text>
        <v-btn
          icon
          color="red"
          class="share-button"
          v-if="shareAvailable"
          @click="() => share(result.nim)"
        >
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "NIMGrid",
  data() {
    return {
      results: [
        {
          nim: "13517015",
          nama: "I Putu Gede Wirasuta Nama Orang Ini Panjang Sekali",
          nimTpb: "16517030",
          jurusan: "Teknik Informatika",
          angkatan: "2017"
        },
        {
          nim: "13517016",
          nama: "I Putu Gede Wirasuta",
          nimTpb: "16517031",
          jurusan: "Teknik Informatika",
          angkatan: "2017"
        },
        {
          nim: "",
          nama: "I Putu Gede Wirasuta",
          nimTpb: "16517032",
          jurusan: "Teknik Informatika",
          angkatan: "2017"
        }
      ]
    };
  },
  methods: {
    async share(nim) {
      const resultData = this.results.filter(el => el.nim === nim)[0];

      let shareText;
      if (resultData.nim) {
        shareText =
          resultData.nama +
          ". Jurusan: " +
          resultData.jurusan +
          " " +
          resultData.angkatan +
          ". NIM: " +
          resultData.nim +
          ". NIM TPB: " +
          resultData.nimTpb;
      } else {
        shareText =
          resultData.nama +
          ". Fakultas: " +
          resultData.jurusan +
          " " +
          resultData.angkatan +
          ". NIM: " +
          resultData.nimTpb;
      }

      const shareData = {
        title: "NIM Finder: " + resultData.name,
        text: shareText
      };

      try {
        await navigator.share(shareData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  },
  computed: {
    shareAvailable() {
      return !!navigator.share;
    }
  }
};
</script>

<style lang="scss" scoped>
.share-button {
  display: block;
  position: absolute;
  bottom: 16px;
  right: 16px;
}
</style>