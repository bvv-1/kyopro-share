<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue"
import pic_atcoder_problem_url from "@/assets/atcoder_problem_url.jpg"
import pic_card_detail from "@/assets/card_detail.jpg"
import pic_tags_submit from "@/assets/tags_submit.jpg"
import pic_card_edit from "@/assets/card_edit.jpg"
</script>

<template>
  <HeaderComponent />

  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <v-row>
          <v-col cols="12" align="center" justify="center">
            <v-sheet rounded="lg" maxWidth="1200px" class="pa-8">
              <div class="how-to-play">
                <!-- ここを編集 -->
                <h2 class="text-h4 pa-4">kyopro shareとは</h2>
                <div class="mt-3 mb-8">
                  <p>kyopro shareは、競技プログラミングの問題を共有するためのWebサービスです。</p>
                  <p>問題を解いているときに出会った「良問」をたくさん褒めて、</p>
                  <p>膨大な時間をかけて準備してくださったWriterさんに感謝しましょう。</p>
                </div>

                <h2 class="text-h4 pa-4">使い方</h2>

                <div class="mt-3 mb-8">
                  <div class="text-left">
                    <h4 class="text-h6 mx-0 my-8"><b>・良問を解く</b></h4>
                    <p>上部のタブから LIST を選択します。</p>
                    <p>カードを押すと、推薦理由が書かれたページが開きます。</p>
                    <p>OPEN PROBLEM を押すと、問題ページが開きます。</p>
                  </div>
                  <v-img
                    :src="pic_card_detail"
                    alt="how to find problem"
                    :width="700"
                    style="box-shadow: 1px 1px 3px rgba(128, 128, 128, 0.5), -1px -1px 3px rgba(255, 255, 255, 0.5)"
                    class="my-12"
                  ></v-img>
                </div>

                <div class="mt-3 mb-8">
                  <div class="text-left">
                    <h4 class="text-h6 mx-0 my-8"><b>・良問を登録する</b></h4>
                    <p>上部のタブから SUBMIT を選択します。</p>
                    <p>必要な情報を入力したら、SUBMIT ボタンを押します。</p>
                    <p>タグとして、問題に関係のある単語を1〜3個つけることができます。</p>
                  </div>
                  <v-img
                    :src="pic_tags_submit"
                    alt="how to submit"
                    :width="700"
                    style="box-shadow: 1px 1px 3px rgba(128, 128, 128, 0.5), -1px -1px 3px rgba(255, 255, 255, 0.5)"
                    class="my-12"
                  ></v-img>
                  <v-img
                    :src="pic_atcoder_problem_url"
                    alt="atcoder problem url"
                    :width="700"
                    style="box-shadow: 1px 1px 3px rgba(128, 128, 128, 0.5), -1px -1px 3px rgba(255, 255, 255, 0.5)"
                    class="my-12"
                  ></v-img>
                </div>

                <div class="mt-3 mb-8">
                  <div class="text-left">
                    <h4 class="text-h6 mx-0 my-8"><b>・登録した情報を変更する</b></h4>
                    <p>上部のタブから LIST を選択します。</p>
                    <p>鉛筆のアイコンを押すと、そのカードの変更依頼ページが開きます。</p>
                    <p>必要な情報を入力したら、SUBMIT ボタンを押します。</p>
                  </div>
                  <v-img
                    :src="pic_card_edit"
                    alt="how to submit edit"
                    :width="700"
                    style="box-shadow: 1px 1px 3px rgba(128, 128, 128, 0.5), -1px -1px 3px rgba(255, 255, 255, 0.5)"
                    class="my-12"
                  ></v-img>
                </div>

                <h2 class="text-h4 pa-4">お問い合わせ先</h2>
                <div class="mt-3 mb-8">
                  <p>
                    <a href="https://twitter.com/EkVzs" target="_blank">@EkVzs</a>
                    までお願いします。
                  </p>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
p {
  font-size: 1.2rem;
  margin: 0.8em;
}
.how-to-play {
  font-size: 1.2rem;
  margin: 0% 15% 0%; /* 上 左右 下 */
}
</style>
