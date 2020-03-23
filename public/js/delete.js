$('#profileDeleteButton').click(function(event){
  $.ajax({
    url:'/delete',
    type:'POST',
    data:{
      id:this.name
    },
    dataType:'json'
  });
  window.location.replace("/profile");
});

$('#profileUpdateButton').click(function(){
  var cardText = document.getElementById("card-text");
  var cardHeader = document.getElementById("card-header");
  cardText.contentEditable = true;
  cardHeader.contentEditable = true;
});

$('#profileSaveButton').click(function(){
  var cardText = document.getElementById("card-text");
  var cardHeader = document.getElementById("card-header");
  cardText.contentEditable = false;
  cardHeader.contentEditable = false;
  $.ajax({
    url:'/update',
    type:'POST',
    data:{
      id:this.name,
      title:cardHeader.innerText,
      description:cardText.innerText
    },
    dataType:'json'
  });
  window.location.replace("/profile");
});
