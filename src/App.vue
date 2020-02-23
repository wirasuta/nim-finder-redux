<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col sm="12" md="8" lg="6" offset-lg="3" offset-md="2">
            <h1 class="title font-weight-bold text-center">
              ITB NIM Finder:
              <span class="highlight">Redux</span>
            </h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" md="8" lg="6" offset-lg="3" offset-md="2">
            <v-text-field
              label="Keyword"
              placeholder="Cari nama atau NIM. ex: wirasuta 17"
              append-icon="mdi-magnify"
              background-color="#fff"
              color="red"
              v-model="searchKeyword"
              :hide-details="true"
              :loading="loading"
              solo
            ></v-text-field>
          </v-col>
        </v-row>
        <nim-grid :search-keyword="searchKeyword" @setLoading="setLoading" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NimGrid from "@/components/NIMGrid.vue";

export default {
  name: "App",
  components: {
    NimGrid
  },
  data: () => ({
    searchKeyword: "",
    loading: false
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
    }
  }
};
</script>

<style lang="scss">
body {
  background: #ededed;
}

.highlight {
  color: #e57373;
}
</style>
