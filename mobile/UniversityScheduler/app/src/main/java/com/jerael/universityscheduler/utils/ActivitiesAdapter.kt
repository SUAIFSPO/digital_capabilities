package com.jerael.universityscheduler.utils

import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.jerael.universityscheduler.models.Activity
import kotlinx.android.synthetic.main.item_activity.view.*
import android.R
import android.view.LayoutInflater


class ActivitiesAdapter: RecyclerView.Adapter<ActivitiesAdapter.ActivitiesViewHolder>() {

    private var activities: MutableList<Activity> = mutableListOf()
    private var days: MutableList<String> = mutableListOf()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ActivitiesViewHolder {
        val view: View = LayoutInflater.from(parent.context)
            .inflate(R.layout.activity_list_item, parent, false)
        return ActivitiesViewHolder(view)
    }

    override fun onBindViewHolder(holder: ActivitiesViewHolder, position: Int) {
        holder.day.text = days[position]
        holder.name.text = activities[position].name
        holder.startTime.text = activities[position].startTime
        holder.endTime.text = activities[position].endTime

        var listeners = ""

        for (i in 0..activities[position].listeners!!.size) {
            listeners = "$listeners, "
        }

        listeners.dropLast(2)

        holder.listeners.text = listeners
        holder.fio.text = activities[position].fio
        holder.link.text = activities[position].link
    }

    override fun getItemCount(): Int = 7

    class ActivitiesViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {

        var day = itemView.day
        var name: TextView = itemView.name
        var startTime = itemView.start_time
        var endTime = itemView.end_time
        var listeners = itemView.listeners
        var fio = itemView.fio
        var link = itemView.link
    }

    fun initActivities(newActivities: MutableList<Activity>) {
        activities = newActivities
    }

    fun initDays(newDays: MutableList<String>) {
        days = newDays
    }

}

