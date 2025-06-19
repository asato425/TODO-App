function updateStatus(date, index, status) {
    const statusElement = document.querySelector(`#status-${date}-${index}`);
    const previousClass = statusElement.className; // 元のクラスを保存

    if (statusElement) {
        // UIを即時更新
        statusElement.className = `status-${status}`;
    }

    fetch(`/update_status/${date}/${index}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
    }).then(response => {
        if (!response.ok) {
            // サーバーエラー時に元の状態に戻す
            if (statusElement) {
                statusElement.className = previousClass;
            }
            alert('ステータスの更新に失敗しました');
        }
    }).catch(() => {
        // ネットワークエラー時に元の状態に戻す
        if (statusElement) {
            statusElement.className = previousClass;
        }
        alert('ネットワークエラーが発生しました');
    });
}

function toggleDetails(element, event) {
    // ステータス選択時は詳細の表示非表示を切り替えない
    if (event.target.tagName.toLowerCase() === 'select') {
        return;
    }
    element.classList.toggle('open');
}

// スクロール位置を保存
window.addEventListener('beforeunload', () => {
    localStorage.setItem('scrollPosition', window.scrollY);
});

// スクロール位置を復元
window.addEventListener('load', () => {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        localStorage.removeItem('scrollPosition'); // 一度復元したら削除
    }
});
