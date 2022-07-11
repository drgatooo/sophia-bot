const ytNotifs = require('yt-notifs')// a no, me quiero
ytNotifs.start(60, './youtubeNotifsData.json') // args: new video check interval in seconds, data file path
ytNotifs.events.on('newVid', (obj) => { // obj is an object containing video info
	console.log(ytNotifs.msg('{channelName} just uploaded a new video!\n{vidUrl}', obj))
	/*
     * all placeholders that can be used with ytNotifs.msg()
     *   {vidName}
     *   {vidUrl}
     *   {vidDescription}
     *   {vidId}
     *   {vidWidth}
     *   {vidHeight}
     *   {vidThumbnailUrl}
     *   {vidThumbnailWidth}
     *   {vidThumbnailHeight}
     *   {channelName}
     *   {channelUrl}
     *   {channelId}
     */
})
ytNotifs.subscribe(['UC7bD_GEqdgUDCe_cyVa6Y2g'])