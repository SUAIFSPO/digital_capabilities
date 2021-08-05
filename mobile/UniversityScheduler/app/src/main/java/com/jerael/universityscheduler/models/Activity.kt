package com.jerael.universityscheduler.models

data class Activity(

    var id: Int? = null,

    var name: String? = null,

    var startTime: String? = null,

    var endTime: String? = null,

    var listeners: List<Listener>? = null,

    var fio: String? = null,

    var link: String? = null

)
