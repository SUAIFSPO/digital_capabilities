package com.jerael.universityscheduler.ui

import android.graphics.Color
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.marginTop
import com.jerael.universityscheduler.R
import com.jerael.universityscheduler.utils.ActivitiesAdapter
import com.jerael.universityscheduler.utils.getSchedule
import kotlinx.android.synthetic.main.activity_main.*
import org.w3c.dom.Text
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

class MainActivity : AppCompatActivity() {



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        this.title = "Расписание занятий"

        val daysList: MutableList<String> = mutableListOf()

        val formatter = DateTimeFormatter.ofPattern("EEEE, d MMMM")

        val currentDate = LocalDate.now()

        val startDate = currentDate.atStartOfDay(ZoneId.systemDefault()).toEpochSecond()

        val endDate = currentDate.plusDays(6).atStartOfDay(ZoneId.systemDefault()).toEpochSecond()

        for (i in 0 until 7) {
            val newDate = currentDate.plusDays(i.toLong()).format(formatter)
            daysList.add(newDate)
        }

        getSchedule(this, startDate, endDate) { activities ->

            if (activities != null) {

                val activitiesAdapter = ActivitiesAdapter()
                activitiesAdapter.initActivities(activities)
                activitiesAdapter.initDays(daysList)

                recycler_view.adapter = activitiesAdapter
            }
        }


    }
}