(async function() {
    const baseUrl = 'https://education.giyudo.com/learn/centos7-trident/';
    let currentChapter = 1;
    const zip = new JSZip();

    let chapterContinueFlag = true;
    while (chapterContinueFlag) {
        let url = `${baseUrl}chapter${currentChapter}/`;
        try {
            await downloadAndAddToZip(url, `chapter${currentChapter}`, `chapter${currentChapter}_`);
        } catch (error) {
            console.error(error);
            chapterContinueFlag = false;
            break;
        }

        let sectionContinueFlag = true;
        let currentSection = 1;
        while (sectionContinueFlag) {
            url = `${baseUrl}chapter${currentChapter}/section${currentSection}/`;
            try {
                await downloadAndAddToZip(url, `chapter${currentChapter}/section${currentSection}`, `chapter${currentChapter}_section${currentSection}_`);
            } catch (error) {
                console.error(error);
                sectionContinueFlag = false;
                break;
            }

            let subSectionContinueFlag = true;
            let currentSubSection = 1;
            while (subSectionContinueFlag) {
                url = `${baseUrl}chapter${currentChapter}/section${currentSection}/subsection${currentSubSection}/`;
                try {
                    await downloadAndAddToZip(url, `chapter${currentChapter}/section${currentSection}/subsection${currentSubSection}`, `chapter${currentChapter}_section${currentSection}_subsection${currentSubSection}_`);
                } catch (error) {
                    console.error(error);
                    subSectionContinueFlag = false;
                    break;
                }

                let subSubSectionContinueFlag = true;
                let currentSubSubSection = 1;
                while (subSubSectionContinueFlag) {
                    url = `${baseUrl}chapter${currentChapter}/section${currentSection}/subsection${currentSubSection}/${currentSubSubSection}/`;
                    try {
                        await downloadAndAddToZip(url, `chapter${currentChapter}/section${currentSection}/subsection${currentSubSection}/${currentSubSubSection}`, `chapter${currentChapter}_section${currentSection}_subsection${currentSubSection}_subsubsection${currentSubSubSection}_`);
                        currentSubSubSection++;
                    } catch (error) {
                        console.error(error);
                        subSubSectionContinueFlag = false;
                    }
                }
                currentSubSection++;
            }
            currentSection++;
        }
        currentChapter++;
    }

    async function downloadFile(url) {
        try {
            console.log(`Downloading: ${url}`);
            let response = await fetch(url);
            if (!response.ok || response.url !== url) throw new Error(`HTTP error or redirect detected! status: ${response.status}`);
            let text = await response.text();
            return text;
        } catch (error) {
            throw error;
        }
    }

    async function downloadAndAddToZip(url, path, filenamePrefix) {
        try {
            let content = await downloadFile(url);
            let title = content.match(/<title>(.*?)<\/title>/);
            let titleText = title ? title[1] : 'no_title';
            let filename = `${filenamePrefix}${titleText}.html`;
            console.log(`Adding to zip: ${path}/${filename}`)
            zip.file(`${path}/${filename}`, content);
        } catch (error) {
            throw error;
        }
    }

    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'pages.zip';
        a.click();
    });
})();
