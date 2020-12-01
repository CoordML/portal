document.addEventListener("DOMContentLoaded", function (event) {
    var data = {
        expId: null
    }

    var app = new Vue({
        el: "#app",
        data: data,
        created: function() {
            const urlParams = new URLSearchParams(window.location.search)
            this.expId = urlParams.get("expId")
        }
    })

    const updateState = () => {
    }

    setInterval(updateState, 1000);
});