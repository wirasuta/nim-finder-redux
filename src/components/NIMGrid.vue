<template>
  <v-row align="start" justify="center">
    <v-col cols="12" sm="12" md="6" lg="4" v-for="result in results" :key="result.ID">
      <v-lazy :options="{
          threshold: .5
        }" transition="fade-transition">
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
      </v-lazy>
    </v-col>
    <v-col cols="12" sm="12" md="8" lg="6" v-if="results.length >= 20">
      <v-btn
        color="red"
        v-if="buttonVisible"
        :loading="buttonLoading"
        :disabled="buttonLoading"
        @click="loadMore"
        outlined
        block
      >Load More...</v-btn>
      <h4 class="subtitle-1 text-center font-italic" v-else>End of search result</h4>
    </v-col>
  </v-row>
</template>

<script>
import debounce from "@/utils/debounce";

export default {
  name: "NIMGrid",
  data() {
    return {
      results: [],
      counter: 0,
      buttonLoading: false,
      buttonVisible: true
    };
  },
  props: {
    searchKeyword: String
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
    },
    async getNamaJurusan(kodeJurusan) {
      const res = await fetch(`/api/jurusan?q=${kodeJurusan}`);
      const data = await res.json();

      if (data.message === "OK") {
        return data.namaJurusan;
      } else {
        return "Unkown";
      }
    },
    async fetchData(keyword) {
      if (keyword.length < 3) {
        this.$emit("setLoading", false);
        return;
      }

      const res = await fetch(`/api/nim?q=${keyword}&p=${this.counter}`);
      const data = await res.json();

      if (data.message === "OK") {
        const nextResults = data.data.map(el => ({
          id: el.ID,
          nim: el.nim_jurusan,
          nama: el.name,
          jurusan: "",
          angkatan: el.nim_tpb.substr(3, 2),
          nimTpb: el.nim_tpb
        }));

        for (let i = 0; i < nextResults.length; i++) {
          const nim = nextResults[i].nim
            ? nextResults[i].nim
            : nextResults[i].nimTpb;

          nextResults[i].jurusan = await this.getNamaJurusan(nim.substr(0, 3));
        }

        this.results = [...this.results, ...nextResults];
      }

      this.$emit("setLoading", false);
    },
    async loadMore() {
      this.buttonLoading = true;

      const preCount = this.results.length;
      this.counter++;
      await this.fetchData(this.searchKeyword);
      const postCount = this.results.length;

      if (preCount === postCount) {
        this.buttonVisible = false;
      }

      this.buttonLoading = false;
    }
  },
  computed: {
    shareAvailable() {
      return !!navigator.share;
    }
  },
  watch: {
    searchKeyword: debounce(function(val) {
      this.$emit("setLoading", true);

      this.buttonVisible = true;
      this.results = [];
      this.counter = 0;

      this.fetchData(val);
    }, 500)
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