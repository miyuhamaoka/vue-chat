<template>
  <v-app id="inspire">
    <Sidebar />
    <v-main>
      <h1>{{ room ? room.name : "" }}</h1>
      <!-- <h1>{{room.name}}</h1> -->
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <v-list two-line>
                <template v-for="(data, index) in messages">
                  <v-list-item :key="index">
                    <!-- <v-list-item v-if="n === 'foobar'" :key="n"> -->
                    <v-list-item-avatar color="grey darken-1">
                      <v-img :src="data.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <!-- <v-list-item-title>Message {{ n }}</v-list-item-title> -->

                      <v-list-item-subtitle class="message">
                        {{ data.message }}
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
              <v-btn
                class="mr-4"
                type="submit"
                :disabled="invalid"
                @click="submit"
              >
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
import firebase from "@/firebase/firebase";
import Sidebar from "@/components/layouts/Sidebar.vue";

export default {
  components: {
    Sidebar,
  },
  async created() {
    this.roomId = this.$route.query.room_id;
    console.log("roomId:", this.roomId);

    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
    const roomDoc = await roomRef.get();
    //存在しないroomIdを指定した場合はトップページにリダイレクト
    if (!roomDoc.exists) {
      await this.$router.push("/");
    }
    5;
    this.room = roomDoc.data();
    console.log("roomDoc:", this.roomDoc);
    console.log("room:", this.room);
    //更新順にする
    // const snapshot = await roomRef
    //   .collection("messages")
    //   .orderBy("createdAt", "asc")
    //   .get();
    // snapshot.forEach((doc) => {
    //   console.log(doc.data());
    //   this.messages.push(doc.data());
    // });

    // const chatRef = firebase.firestore().collection("chats")
    // console.log("chatRef:" ,chatRef)
    // const snapshot = await chatRef.get()
    // console.log("snapshot",snapshot)

    // snapshot.forEach(doc => {
    //     console.log(doc.data())
    //     this.messages.push(doc.data())
    // })
  },
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.auth)

    const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
    roomRef.collection("messages").orderBy("createdAt", "asc")
    .onSnapshot(snapshot =>{
      snapshot.docChanges().forEach(change =>{
        console.log("new message:", change.doc.data())
        this.messages.push(change.doc.data())
      })
    })
  },
  data: () => ({
    messages: [
      // {message:"message 1"},
      // {message:"message 2"},
      // {message:"message 3"},
      // {message:"message 4"},
      // {message:"message 5"}
    ],
    body: "",
    roomId: "",
    room: null,
    cards: ["Today"],
    drawer: null,
    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],
    auth: null,
  }),
  //bodyの変更を検知して処理(空の時trueでボタン押せない)
  computed: {
    invalid() {
      console.log("invalid call", this.body);
      if (!this.body) {
        return true;
      }
      return false;
    },
  },
  methods: {
    clear() {
      console.log("clear call");
      this.body = ""; //入力欄を空にする
    },
    submit() {
      console.log("submit call", this.body);
      // this.messages.push({
      //   message: this.body,
      //   name: this.auth.displayName,
      //   photoURL: this.auth.photoURL,
      //   createdAt: firebase.firestore.Timestamp.now(),
      // });


      const roomRef = firebase.firestore().collection("rooms").doc(this.roomId);
      roomRef.collection("messages").add({
        message: this.body,
        name: this.auth.displayName,
        photoURL: this.auth.photoURL,
        createdAt: firebase.firestore.Timestamp.now(),
      })
      .then(result =>{
        console.log("success:", result)
        this.body =""
      })
      .catch(error =>{
        console.log("fail:",error)
        alert("メッセージの送信に失敗しました")
      })
    },
  },
};
</script>

<style>
.message {
  text-align: left;
}
</style>
