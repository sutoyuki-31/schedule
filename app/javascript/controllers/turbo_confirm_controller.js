import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // ボタンがクリックされた瞬間に強制発動するアクション
  confirm(event) {
    // 1. まず通常の削除処理（送信）を完全にストップさせる
    event.preventDefault()
    event.stopPropagation()

    // 2. 削除フォームの要素を取得しておく
    const form = this.element

    // 3. すでに画面に古いモーダルが残っていれば削除する
    const existingModal = document.getElementById('turbo-confirm-modal')
    if (existingModal) existingModal.remove()

    // 4. 新しいBootstrap 5用のモーダルHTMLを作成
    const modalHtml = `
      <div class="modal fade" id="turbo-confirm-modal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" style="color: #333; font-weight: bold;">確認</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0" style="color: #333; font-size: 16px;">予定を削除しますか？</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-danger" id="turbo-confirm-commit-btn">実行する</button>
            </div>
          </div>
        </div>
      </div>
    `

    // 5. 画面の最下部にモーダルを挿入する
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    // 6. グローバル（window）にあるBootstrapを使ってモーダルを起動する
    const modalElement = document.getElementById('turbo-confirm-modal')
    const bootstrapModal = new window.bootstrap.Modal(modalElement)
    bootstrapModal.show()

    // 7. 「実行する」ボタンが押されたら、ストップしていた削除フォームを強制送信する
    document.getElementById('turbo-confirm-commit-btn').addEventListener('click', () => {
      bootstrapModal.hide()
      form.submit() // ここで初めて削除が実行されます
    })
  }
}
