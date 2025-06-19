function updateStatus(date, index, status) {
    fetch(`/update_status/${date}/${index}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                const statusElement = document.querySelector(`#status-${data.index}`);
                if (statusElement) {
                    statusElement.textContent = data.status;
                }
            });
        } else {
            alert('ステータスの更新に失敗しました');
        }
    });
}

function toggleDetails(element, event) {
    // ステータス選択時は詳細の表示非表示を切り替えない
    if (event.target.tagName.toLowerCase() === 'select') {
        return;
    }
    element.classList.toggle('open');
}
