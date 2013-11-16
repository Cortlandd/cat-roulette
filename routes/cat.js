/*
 * GET users listing.
 */
exports.list = function(req, res){

  var googleapis = require('googleapis');

  // This comes from ENV['GOOGLE_API_KEY']
  // On heroku, set this with "heroku config:add GOOGLE_API_KEY=..."
  API_KEY = process.env.GOOGLE_API_KEY


  googleapis
      .discover('youtube','v3')
      .execute(function(err, client) {

    var params = {
      q:                'cat',
      part:             'snippet', 
      type:             'video',
      videoEmbeddable:  'true',
      videoDuration:    'short',
      safeSearch:       'strict',
      maxResults:       50,
      fields:           'items(id,snippet)'
    }
    
    var req = client.youtube.search.list(params).withApiKey(API_KEY);


    req.execute(function (err, response) {
      //console.log('client', client);
      //console.log('youtube response', response.items);
      //console.log('error', err);

      var rval = [];
      
      response.items.forEach(function(item, index) {
        //console.log('item', item);
        var cat = {
          'id': item.id.videoId,
          'image': item.snippet.thumbnails.high.url
        };
        rval.push(cat);
      });

      //console.log('rval',rval);

      res.json(rval);
    });
  });
};