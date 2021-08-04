package com.jerael.universityscheduler.models

import com.google.gson.JsonArray

data class ActivitiesResponse(

    var success: Boolean? = null,

    var schedule: JsonArray? = null

)
