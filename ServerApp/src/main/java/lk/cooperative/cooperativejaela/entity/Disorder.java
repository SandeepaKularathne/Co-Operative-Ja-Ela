package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Disorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "disonumber")
    private String disonumber;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "disrequests_id", referencedColumnName = "id", nullable = false)
    private Disrequests disrequests;
    @ManyToOne
    @JoinColumn(name = "postatus_id", referencedColumnName = "id", nullable = false)
    private Postatus postatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id", nullable = false)
    private Vehicle vehicle;
    @OneToMany(mappedBy = "disorder")
    private Collection<Disorderitem> disorderitems;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDisonumber() {
        return disonumber;
    }

    public void setDisonumber(String disonumber) {
        this.disonumber = disonumber;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Disorder disorder = (Disorder) o;
        return id == disorder.id && Objects.equals(disonumber, disorder.disonumber) && Objects.equals(date, disorder.date) && Objects.equals(description, disorder.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, disonumber, date, description);
    }

    public Disrequests getDisrequests() {
        return disrequests;
    }

    public void setDisrequests(Disrequests disrequests) {
        this.disrequests = disrequests;
    }

    public Postatus getPostatus() {
        return postatus;
    }

    public void setPostatus(Postatus postatus) {
        this.postatus = postatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Collection<Disorderitem> getDisorderitems() {
        return disorderitems;
    }

    public void setDisorderitems(Collection<Disorderitem> disorderitems) {
        this.disorderitems = disorderitems;
    }
}
