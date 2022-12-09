<template>
  <v-app id="inspire">
    <Sidebar /> 
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <v-list two-line>
                <template v-for="(data,index) in messages">
                  <v-list-item :key="index">
                    <!-- <v-list-item v-if="n === 'foobar'" :key="n"> -->
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <!-- <v-list-item-title>Message {{ n }}</v-list-item-title> -->

                      <v-list-item-subtitle class="message">
                        {{data.message}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                    v-if="n !== 6"
                    :key="`divider-${index}`"
                    inset
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- ページ下部テキストエリア -->
      <template>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-textarea
              v-model="body"
                class="mx-2"
                label="メッセージを送信する"
                rows="3"
                prepend-icon="mdi-comment"
                auto-grow
              ></v-textarea>
              <v-btn class="mr-4" type="submit" :disabled="invalid" @click="submit">
                submit
              </v-btn>
              <v-btn @click="clear"> clear </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-main>
  </v-app>
</template>
<script>
import firebase from "@/firebase/firebase"
import Sidebar from "@/components/layouts/Sidebar.vue"

export default {
    components:{
        Sidebar
    },
  async created() {
    this.user_id = this.$route.query.user_id;
    console.log("user_id:", this.user_id);

    const chatRef = firebase.firestore().collection("chats")
    console.log("chatRef:" ,chatRef)
    const snapshot = await chatRef.get()
    console.log("snapshot",snapshot)

    snapshot.forEach(doc => {
        console.log(doc.data())
        this.messages.push(doc.data())
    })
  },
  data: () => ({
    messages:[
        // {message:"message 1"},
        // {message:"message 2"},
        // {message:"message 3"},
        // {message:"message 4"},
        // {message:"message 5"}
    ],
    body:"",
    user_id: "",
    cards: ["Today"],
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
  }),
  //bodyの変更を検知して処理(空の時trueでボタン押せない)
  computed:{
    invalid(){
        console.log("invalid call", this.body)
        if(!this.body){
            return true;
        }
        return false;
    }
  },
  methods:{
    clear(){
        console.log("clear call")
        this.body = ""; //入力欄を空にする
    },
    submit(){
        console.log("submit call", this.body)
        this.messages.unshift({message:this.body}); //unshiftで最新の追加を一番上に
        this.body = ""; //追加後入力欄を空にする
    },
  }
};
</script>

<style>
.message {
  text-align: left;
}
</style>
