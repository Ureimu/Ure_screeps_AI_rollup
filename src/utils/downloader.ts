export default {
    download(data: string, docName: string): void {
        const id = `id${Math.random()}`;
        /* eslint-disable */
        const download = `
<script>
var element = document.getElementById('${id}');
if (!element) {
  element = document.createElement('a');
  element.setAttribute('id', '${id}');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,${encodeURIComponent(data)}');
  element.setAttribute('download', '${docName}');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
}
</script>
    `;
        /* eslint-enable */
        console.log(
            download
                .split("\n")
                .map(s => s.trim())
                .join("")
        );
    }
};
