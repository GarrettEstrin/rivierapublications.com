<?php include 'header.php'; ?>
<?php include 'modals.php'; ?>
  <div class="agileits-banner jarallax">
    <?php include 'navigation.php' ?>
      <div class="container pub-container">
        <div id="flipbook">
          <?php 
            $dir = './pubs/neighborhood2020';
            $files = array_slice(scandir($dir), 2);
            natsort($files);
            $files = array_values($files);
            if($files[0] == '.DS_Store'){
              unset($files[0]);
              $files = array_values($files);
            }
            for($i=0;$i<count($files);$i++){
              echo '<div class="pub__page"><img class="pub__image" src="pubs/neighborhood2020/'. $files[$i] .'" alt=""></div>';
            }
          ?>
        </div>
      </div>
  </div>
  <?php include 'footer.php' ?>
<script src="js/turn.min.js"></script>
<script>
  $("#flipbook").turn({
    width: '100%',
    height: '660px',
    autoCenter: true
  });
  function isPage1Showing(){
    var pages = $('.page-wrapper');
    if(pages.children().first().offsetLeft == 0){
      console.log('page 1 is showing');
      return true;
    } else {
      return false;
    }
  }
  var originalFlipBookMarginLeft = $('#flipbook').css('margin-left');
  var flipBookContainer = $('#flipbook');
  var originalFlipBookMarginLeft = flipBookContainer.css('margin-left');
  var originalFlipBookWidth = flipBookContainer.css('width');
  //flipBookContainer.css('width', '612px');
  flipBookContainer.css('margin-left', '260px');
</script>