/**
 * Created by yangl on 2016/5/17.
 */

var path_local = "dist/data/";

var path_remote = "http://zzj.liuruidong.net/cloud/api.php/";

var path = path_remote;

//加载首页请求的API，不需要参数
var index_path = "index";

//请求资讯列表API，带查询条件的参数（可为空）
var news_list_path = "news/lists";

//资讯的下拉刷新，带参数
var news_list_for_refresh_path = "news/lists";

//资讯的上拉翻页，带参数
var news_list_for_load_path ="news/lists";

//资讯详情页面API，带参数
var news_detail_path = "news/detail";

//首页点击吨数/品牌进入的产品页面，需要参数
var index_to_product_path = "product/lists";

var product_list_next_page_ptah = "product/lists"; //首页点击吨数/品牌进入的产品页面的上拉翻页功能，带参数
var product_with_condition_path = "product/lists";//首页点击吨数/品牌进入的产品页面的点击品牌、吨数、排序等功能，带参数

//产品详情页面API，带参数
var product_detail_path = "product/detail";

//从产品详情进入该产品的具体图库，带参数
var product_pic_detail_path = "pictures";

//进入视频列表的API，不需要参数
var video_list_path = "video/lists";

//进入产品图库的品牌列表，不需要参数
var brand_list_path = "brand/lists";

//产品图库点击出现的侧边栏的产品数据，带参数
var brand_to_product_path = "product/lists";

var search_path = "search";

var shangpin_path = "shangpin/lists";
var shangpin_next_path = "shangpin/lists";//商品分页
var shangpin_load_path = "shangpin/lists";//商品下一页


$(function () {
    'use strict';
    var loadflag = false;
    $(document).on("pageInit", "#news_page", function(e, pageId, $page) {
        console.log("果然加载资讯了。。." + loadflag);
        if (loadflag) return;
        loadflag = true;
        var $search_key = GetQueryString("search");
        giveSearch($search_key);
        console.log("查询条件。。." + $search_key);
        $.ajax({
            type:"get",//请求方式
            url: path + news_list_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/news.json",//发送请求地址
           data:{//发送给数据库的数据
               searchKey:$search_key
           },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initNews(data.data.news);
            }
        });

        refreshLoad();
        loadLast();
    });

    var flag = false;
    $(document).on("pageInit", "#news_detail_page", function(e, pageId, $page) {
        console.log("是否已经加载："+ flag);

        flag = true;

       var $newsId = GetQueryString("newsId");
       console.log("传过来的newsId:" + $newsId);
        $.ajax({
            type:"get",//请求方式
            url:path + news_detail_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/news_detail.json",//发送请求地址
           data:{//发送给数据库的数据
               news_id:$newsId
           },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                console.log("资讯详情:" + data.data);
                initNewsDetail(data.data);
            }
        });
    });

    /**
     * 页面初始化首页点击品牌进入的产品页面
     */
    var brand_page_flag = false;
    $(document).on("pageInit", "#product_page", function(e, pageId, $page) {
        console.log("果然加载资讯了。。." + loadflag);
        //if (brand_page_flag) return;
        brand_page_flag = true;
        var $brandId = GetQueryString("brandId");
        var $brandName = GetQueryString("brand_name");
        console.log("传过来的品牌Id:" + $brandId);
        giveBrandId($brandId, $brandName);
        giveLoadFlag(brand_page_flag);

        $.ajax({
            type:"get",//请求方式
            url:path + index_to_product_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/product.json",//发送请求地址
           data:{//发送给数据库的数据
               brand_id: $brandId
           },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initProduct(data.data.product);
            }
        });
        loadLast();
        
        doLoadData();
    });


    var product_detail_flag = false;
    $(document).on("pageInit", "#product_detail_page", function(e, pageId, $page) {
        console.log("产品详情页是否已经加载："+ flag);

        product_detail_flag = true;

        var $productId = GetQueryString("productId");
        giveProductId($productId);
        console.log("传过来的productId:" + $productId);
        $.ajax({
            type:"get",//请求方式
            url:path + product_detail_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/product_detail.json",//发送请求地址
           data:{//发送给数据库的数据
               product_id:$productId
            },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                console.log("产品详情:" + data.data);
                initProductDetail(data.data);
            }
        });
        
        loadSwiper();
    });


    var product_picture_flag = false;
    $(document).on("pageInit", "#product_picture_div", function(e, pageId, $page) {
        console.log("产品图库是否已经加载："+ flag);

        product_picture_flag = true;

        var $productId = GetQueryString("productId");
        console.log("传过来的productId:" + $productId);
        $.ajax({
            type:"get",//请求方式
            url:path + product_pic_detail_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/picture_detail.json",//发送请求地址
           data:{//发送给数据库的数据
               product_id:$productId
           },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                console.log("产品详情:" + data.data);
                initProductPicture(data.data);
            }
        });

        //loadSwiper();
    });

    /**
     * 页面初始化以吨位为条件查询的商品页面
     */
    var tons_page_flag = false;
    $(document).on("pageInit", "#tons_page", function(e, pageId, $page) {
        console.log("果然加载以吨数为条件的初始页面了。。." + loadflag);
        //if (brand_page_flag) return;
        brand_page_flag = true;
        var $minTon = GetQueryString("minTon");
        var $maxTon = GetQueryString("maxTon");
        console.log("传过来的吨数最小:" + $minTon);
        giveTons($minTon, $maxTon);
        //giveLoadFlag(brand_page_flag);

        $.ajax({
            type:"get",//请求方式
            url:path + index_to_product_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/product.json",//发送请求地址
            data:{//发送给数据库的数据
                minTon:$minTon,
                maxTon:$maxTon
            },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initProduct(data.data.product);
            }
        });
        loadLast();

        doLoadData();

        loadBrands();
    });
    
    var video_page_flag = false;
    $(document).on("pageInit", "#video_page", function(e, pageId, $page) {
        if (video_page_flag) return;
        video_page_flag = true;

        $.ajax({
            type:"get",//请求方式
            url:path + video_list_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/video.json",//发送请求地址
            // data:{//发送给数据库的数据
            //    username:$("#username").val(),
            //    content:$("#content").val()
            // },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initVideo(data.data.video);
            }
        });

        //refreshLoad();
        loadLast();
    });

    var photo_page_flag = false;
    $(document).on("pageInit", "#photo_page", function(e, pageId, $page) {
        console.log("图库加载了吗？"+ photo_page_flag);
        if (photo_page_flag) return;
        photo_page_flag = true;

        loadBrands();
    });

    var video_watch_page_flag = false;
    $(document).on("pageInit", "#photo_page", function(e, pageId, $page) {
        console.log("开始播放视频加载了吗页面？"+ video_watch_page_flag);
        if (video_watch_page_flag) return;
        video_watch_page_flag = true;

        var video_src = GetQueryString("video_src");
        initVideoWatch(video_src);
        
    });

    var shangpinloadflag= false;
    $(document).on("pageInit", "#product_list_page", function(e, pageId, $page) {
        console.log("果然加载商品了。。." + loadflag);
        if (shangpinloadflag) return;
        shangpinloadflag = true;

        $.ajax({
            type:"get",//请求方式
            url: path + shangpin_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/news.json",//发送请求地址
            data:{//发送给数据库的数据

            },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initProducts(data.data.product);
            }
        });

        refreshLoad();
        loadLast();
    });

    /**
     * 点击搜索里的产品的查看更多进入的页面，把查询条件带过去，到吨数的产品页面
     */
    var search_product_page_flag = false;
    $(document).on("pageInit", "#product_with_contiton_page", function(e, pageId, $page) {

        //if (search_product_page_flag) return;
        search_product_page_flag = true;
        var $search= GetQueryString("search");
        console.log("查询条件:" + $search);
        //giveBrandId($brandId);
        giveSearch($search);
        giveLoadFlag(brand_page_flag);

        $.ajax({
            type:"get",//请求方式
            url:path + index_to_product_path,//发送请求地址
            //url:"http://owiss-cloud.test.liuruidong.net/zzj/product.json",//发送请求地址
            data:{//发送给数据库的数据
                search: $search
            },
            async: false,
            //请求成功后的回调函数有两个参数
            success:function(data,textStatus){
                initProduct(data.data.product);
            }
        });
        loadLast();

        doLoadData();
    });

    
    $.init();
})

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}