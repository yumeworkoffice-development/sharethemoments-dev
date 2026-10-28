# sharethemoments-dev

repository-root/
├── index.html            # ゲスト用アプリ（エントリーポイント）
├── signage.html          # サイネージ投影画面
├── admin.html            # 新郎新婦用 管理コンソール画面
├── css/
│    └── style.css        # 共通のデザイン・スタイルシート
└── js/
      ├── main.js          # ゲスト用アプリのコントローラー
      ├── signage.js       # サイネージ用コントローラー（自動更新・スライド制御）
      ├── admin.js         # 管理画面用コントローラー（設定切替・画像追加など）
      ├── api.js           # 【要！】GASとの通信レイヤー（全APIリクエストを集約）
      ├── uploader.js      # 画像の選択・Canvas圧縮・チャンク送信
      └── modal.js         # テーブル選択・ゲスト名選択などのポップアップ制御
